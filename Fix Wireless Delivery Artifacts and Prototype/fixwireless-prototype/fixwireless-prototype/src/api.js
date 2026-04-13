/**
 * RepairQ API Client — Fix Wireless Prototype
 * Calls the real sandbox API; falls back to rich mock data if unreachable.
 *
 * Sandbox base: https://api.repairq-sandbox.servicecentral.com/v2
 * Auth: Bearer token from POST /auth/token
 */

const API = {
  BASE:          'https://api.repairq-sandbox.servicecentral.com/v2',
  CLIENT_ID:     'sandbox_fixwireless_001',
  CLIENT_SECRET: 'sk_sandbox_qf_2024_test',
  _token:        null,

  async getToken() {
    if (this._token) return this._token;
    try {
      const r = await fetch(`${this.BASE}/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: this.CLIENT_ID, client_secret: this.CLIENT_SECRET }),
      });
      const data = await r.json();
      this._token = data.access_token;
      return this._token;
    } catch {
      return null;  // sandbox unreachable — use mock
    }
  },

  async get(path, params = {}) {
    const token = await this.getToken();
    const qs = new URLSearchParams(params).toString();
    const url = `${this.BASE}${path}${qs ? '?' + qs : ''}`;
    try {
      const r = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!r.ok) throw new Error(r.status);
      return await r.json();
    } catch {
      return null;  // triggers mock fallback
    }
  },

  /* ── Endpoint wrappers ── */

  async getLocations(region = null) {
    const params = { per_page: 100 };
    if (region && region !== 'all') params.region = region;
    const data = await this.get('/locations', params);
    return data?.data ?? null;
  },

  async getTicketSummary(region = null) {
    const params = { period: 'today', group_by: 'location' };
    if (region && region !== 'all') params.region = region;
    const data = await this.get('/tickets/summary', params);
    return data?.data ?? null;
  },

  async getStaleTickets() {
    // Tickets open > 48 hrs = checked_in or in_repair, older than 2 days
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    const data = await this.get('/tickets', {
      status: 'in_repair',
      created_before: twoDaysAgo,
      sort: 'created_at',
      order: 'asc',
      per_page: 10,
    });
    return data?.data ?? null;
  },

  async getPartsSummary() {
    const data = await this.get('/parts/summary', { alert_only: false });
    return data?.data ?? null;
  },
};


/* ════════════════════════════════════════════
   MOCK DATA — used when sandbox is unreachable
   ════════════════════════════════════════════ */
const MOCK = {
  locations(region) {
    const all = [
      { id:'loc_001', name:'Atlanta Midtown',    region:'southeast', b0:34, b1:12, b2:0, avg:21.4 },
      { id:'loc_002', name:'Tampa Westshore',    region:'southeast', b0:28, b1:18, b2:3, avg:34.2 },
      { id:'loc_003', name:'Orlando Mills',      region:'southeast', b0:41, b1:9,  b2:2, avg:27.8 },
      { id:'loc_004', name:'Dallas Uptown',      region:'midwest',   b0:55, b1:21, b2:1, avg:24.1 },
      { id:'loc_005', name:'Miami Beach',        region:'southeast', b0:22, b1:8,  b2:4, avg:41.7 },
      { id:'loc_006', name:'Charlotte Plaza',    region:'southeast', b0:38, b1:14, b2:0, avg:19.3 },
      { id:'loc_007', name:'Houston Galleria',   region:'midwest',   b0:47, b1:19, b2:2, avg:28.5 },
      { id:'loc_008', name:'Nashville Music Row', region:'southeast', b0:29, b1:11, b2:0, avg:22.1 },
      { id:'loc_009', name:'NYC Midtown',        region:'northeast', b0:61, b1:24, b2:1, avg:25.8 },
      { id:'loc_010', name:'Los Angeles West',   region:'west',      b0:44, b1:16, b2:2, avg:30.2 },
    ];
    return region && region !== 'all' ? all.filter(l => l.region === region) : all;
  },

  staleTickets: [
    { id:'tkt_001', ticket_number:'RQ-2024-00451', device:'iPhone 15 Pro · Screen replacement', location:'Tampa Westshore',    status:'waiting_parts', created_at: new Date(Date.now()-52*3600*1000).toISOString() },
    { id:'tkt_002', ticket_number:'RQ-2024-00389', device:'Samsung S24 · Battery swap',         location:'Orlando Mills',      status:'in_repair',      created_at: new Date(Date.now()-61*3600*1000).toISOString() },
    { id:'tkt_003', ticket_number:'RQ-2024-00412', device:'iPhone 14 · Water damage diag.',     location:'Atlanta Midtown',    status:'diagnosing',     created_at: new Date(Date.now()-49*3600*1000).toISOString() },
    { id:'tkt_004', ticket_number:'RQ-2024-00398', device:'Google Pixel 8 · Charging port',     location:'Miami Beach',        status:'waiting_parts',  created_at: new Date(Date.now()-55*3600*1000).toISOString() },
    { id:'tkt_005', ticket_number:'RQ-2024-00371', device:'iPhone 13 · Back glass',             location:'Nashville Music Row', status:'in_repair',      created_at: new Date(Date.now()-72*3600*1000).toISOString() },
  ],

  partsSummary: {
    total_skus: 312,
    total_inventory_value: 287450,
    alerts: { out_of_stock: 23, low_stock: 45, overstocked: 18 },
    parts: [
      { part_id:'p1', sku:'SCR-APL-15P-OEM', name:'iPhone 15 Pro Screen (OEM)',      total_quantity:347, imbalance_score:8.7, alert:'imbalanced', fill_pct:85 },
      { part_id:'p2', sku:'BAT-APL-14-OEM',  name:'iPhone 14 Battery',              total_quantity:12,  imbalance_score:7.2, alert:'out_of_stock', fill_pct:8 },
      { part_id:'p3', sku:'SCR-SAM-S24-OEM', name:'Samsung S24 Screen (OEM)',       total_quantity:34,  imbalance_score:5.1, alert:'low_stock',  fill_pct:22 },
      { part_id:'p4', sku:'BAT-APL-15-OEM',  name:'iPhone 15 Battery',             total_quantity:89,  imbalance_score:2.1, alert:'adequate',   fill_pct:60 },
      { part_id:'p5', sku:'CPT-APL-15-OEM',  name:'iPhone 15 Charging Port',        total_quantity:5,   imbalance_score:6.4, alert:'out_of_stock', fill_pct:4 },
    ],
  },

  heatData: {
    parts: [
      'iPhone 15 Pro Screen',
      'iPhone 14 Battery',
      'Samsung S24 Screen',
      'iPhone 15 Battery',
      'Charging Port iP15',
    ],
    locations: ['Atlanta', 'Tampa', 'Orlando', 'Dallas', 'Miami'],
    // 0=adequate, 1=ok, 2=low, 3=out, 4=over
    matrix: [
      [0, 4, 3, 0, 2],
      [3, 0, 2, 1, 0],
      [1, 2, 0, 1, 3],
      [0, 1, 0, 0, 1],
      [2, 3, 1, 0, 2],
    ],
  },
};
