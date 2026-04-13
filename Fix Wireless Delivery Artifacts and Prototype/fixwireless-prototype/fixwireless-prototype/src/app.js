/**
 * Fix Wireless Ops Dashboard — App Logic
 * Fetches from sandbox API (with mock fallback) and renders all panels.
 */

/* ── State ── */
let currentRegion = 'all';
let currentLocations = [];
let apiConnected = false;

/* ── Panel navigation ── */
const PANEL_META = {
  tickets: { title: 'Ticket Aging Dashboard',  crumb: 'All regions · Live view' },
  parts:   { title: 'Parts Inventory',          crumb: 'Cross-location stock view' },
  notifs:  { title: 'Customer Notifications',   crumb: 'SMS configuration' },
};

function switchPanel(id, el) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('panel-' + id).classList.add('active');
  if (el) el.classList.add('active');
  document.getElementById('page-title').textContent = PANEL_META[id].title;
  document.getElementById('page-crumb').textContent = PANEL_META[id].crumb;
}

/* ── Data loading ── */
async function loadAll(region = 'all') {
  currentRegion = region;
  updateApiBar('loading');

  // Try real API first; fall back to mock
  const [apiLocs, apiTickets, apiStale, apiParts] = await Promise.all([
    API.getLocations(region),
    API.getTicketSummary(region),
    API.getStaleTickets(),
    API.getPartsSummary(),
  ]);

  apiConnected = !!apiLocs;

  // Locations / aging data
  const locs = buildLocationData(apiLocs, apiTickets, region);
  currentLocations = locs;
  renderAgingTable(locs);
  renderKPIs(locs);

  // Stale tickets
  renderStaleTickets(apiStale ?? MOCK.staleTickets);

  // Parts
  const parts = apiParts ?? MOCK.partsSummary;
  renderPartsKPIs(parts);
  renderPartsTable(parts.parts);

  // Heat map (always mock for prototype — real API doesn't aggregate cross-location by part in one call)
  renderHeatMap(MOCK.heatData);

  updateApiBar('connected');
}

function buildLocationData(apiLocs, apiTickets, region) {
  // If we have real API data, map it; otherwise use mock
  if (apiLocs && apiTickets?.groups) {
    return apiTickets.groups.map(g => {
      const bs = g.tickets_by_status ?? {};
      const b0 = (bs.checked_in ?? 0) + (bs.diagnosing ?? 0);
      const b1 = (bs.in_repair ?? 0) + (bs.waiting_parts ?? 0);
      const b2 = 0; // 48+ not directly in API — approximate
      return { name: g.group_label, b0, b1, b2, avg: g.avg_turnaround_hours ?? 0 };
    });
  }
  return MOCK.locations(region);
}

/* ── KPI rendering ── */
function renderKPIs(locs) {
  const b0 = locs.reduce((s, l) => s + l.b0, 0);
  const b1 = locs.reduce((s, l) => s + l.b1, 0);
  const b2 = locs.reduce((s, l) => s + l.b2, 0);
  const avg = locs.length ? (locs.reduce((s, l) => s + l.avg, 0) / locs.length).toFixed(1) : '--';

  setText('kpi-green', b0);
  setText('kpi-amber', b1);
  setText('kpi-red', b2);

  const critEl = document.getElementById('critical-alert');
  if (b2 > 0) {
    critEl.style.display = 'flex';
    critEl.innerHTML = `⚠ <strong>${b2} tickets</strong> have been open &gt;48 hours — requires immediate attention`;
  } else {
    critEl.style.display = 'none';
  }
}

/* ── Aging table ── */
function renderAgingTable(locs) {
  const tbody = document.getElementById('aging-tbody');
  if (!locs.length) { tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:20px">No locations found</td></tr>'; return; }

  tbody.innerHTML = locs.map(l => {
    const tot = l.b0 + l.b1 + l.b2 || 1;
    const urgency = l.b2 > 0 ? 'background:var(--red-bg)' : '';
    return `
      <tr style="${urgency}">
        <td style="font-weight:600">${l.name}</td>
        <td class="center"><span class="num-green">${l.b0}</span><br><span style="font-size:10px;color:var(--text-muted)">${Math.round(l.b0/tot*100)}%</span></td>
        <td class="center"><span class="num-amber">${l.b1}</span><br><span style="font-size:10px;color:var(--text-muted)">${Math.round(l.b1/tot*100)}%</span></td>
        <td class="center">
          <span class="num-red">${l.b2}</span>
          ${l.b2 > 0 ? '<br><span class="badge badge-red">Action</span>' : ''}
        </td>
        <td>${l.avg ? l.avg.toFixed(1) + 'h' : '--'}</td>
      </tr>`;
  }).join('');
}

/* ── Stale tickets ── */
function renderStaleTickets(tickets) {
  const tbody = document.getElementById('stale-tbody');
  if (!tickets.length) { tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:20px">No stale tickets 🎉</td></tr>'; return; }

  tbody.innerHTML = tickets.map(t => {
    const created = new Date(t.created_at);
    const hrs = Math.round((Date.now() - created) / 3600000);
    const ageColor = hrs > 60 ? 'color:var(--red-light);font-weight:600' : 'color:var(--amber-light);font-weight:600';
    const statusBadge = {
      waiting_parts: '<span class="badge badge-amber">Waiting parts</span>',
      in_repair:     '<span class="badge badge-red">In repair</span>',
      diagnosing:    '<span class="badge badge-amber">Diagnosing</span>',
    }[t.status] ?? `<span class="badge badge-blue">${t.status}</span>`;
    return `
      <tr>
        <td style="color:var(--blue-mid);font-weight:600">${t.ticket_number}</td>
        <td>${t.device ?? (t.device?.manufacturer + ' ' + t.device?.model + ' · ' + t.repair_type?.name)}</td>
        <td>${t.location ?? t.location_id}</td>
        <td>${statusBadge}</td>
        <td>${created.toLocaleDateString()}</td>
        <td style="${ageColor}">${hrs}h</td>
      </tr>`;
  }).join('');
}

/* ── Parts KPIs ── */
function renderPartsKPIs(parts) {
  const al = parts.alerts ?? {};
  // KPIs are rendered static from mock in HTML — update if data differs
}

/* ── Parts table ── */
function renderPartsTable(parts) {
  const tbody = document.getElementById('parts-tbody');
  tbody.innerHTML = parts.map(p => {
    const alertBadge = {
      imbalanced:    '<span class="badge badge-red">Imbalanced</span>',
      out_of_stock:  '<span class="badge badge-red">Out of stock</span>',
      low_stock:     '<span class="badge badge-amber">Low stock</span>',
      adequate:      '<span class="badge badge-green">Adequate</span>',
    }[p.alert] ?? '';
    const fillClass = { out_of_stock:'fill-out', low_stock:'fill-low', adequate:'fill-ok', imbalanced:'fill-over' }[p.alert] ?? 'fill-ok';
    const fillPct = p.fill_pct ?? 50;
    const isDisabled = p.alert === 'adequate';
    const scoreColor = p.imbalance_score > 6 ? 'color:var(--red-light)' : p.imbalance_score > 4 ? 'color:var(--amber-light)' : 'color:var(--text-muted)';
    const action = p.alert === 'imbalanced' ? `Transfer` : p.alert === 'adequate' ? `Transfer` : `Reorder`;
    return `
      <tr>
        <td>
          <div style="font-weight:600">${p.name}</div>
          <div style="font-size:10px;color:var(--text-muted)">${p.sku}</div>
        </td>
        <td>
          <div class="mini-bar-wrap">
            <div class="mini-bar"><div class="mini-fill ${fillClass}" style="width:${fillPct}%"></div></div>
            <span style="font-size:11px;color:var(--text-muted)">${fillPct}%</span>
          </div>
        </td>
        <td>${p.total_quantity.toLocaleString()}</td>
        <td>${alertBadge}</td>
        <td style="${scoreColor};font-weight:600">${p.imbalance_score.toFixed(1)}</td>
        <td>
          <button class="btn-transfer" ${isDisabled ? 'disabled' : ''}
            onclick="showTransfer('${p.name}', '${p.alert}')">
            ${action}
          </button>
        </td>
      </tr>`;
  }).join('');
}

/* ── Heat map ── */
function renderHeatMap(data) {
  const container = document.getElementById('heat-container');
  const cols = data.locations.length + 1;
  const classes = ['heat-ok', 'heat-ok', 'heat-low', 'heat-out', 'heat-over'];
  const labels  = ['OK', 'OK', 'Low', 'Out', 'Over'];

  let grid = `<div class="heat-grid" style="grid-template-columns: 160px repeat(${data.locations.length}, 1fr);">`;

  // Header row
  grid += '<div></div>';
  data.locations.forEach(l => {
    grid += `<div class="heat-col-label">${l}</div>`;
  });

  // Data rows
  data.parts.forEach((part, pi) => {
    grid += `<div class="heat-row-label">${part}</div>`;
    data.locations.forEach((loc, li) => {
      const v = data.matrix[pi][li];
      grid += `<div class="heat-cell ${classes[v]}" title="${part} · ${loc} · ${labels[v]}">${labels[v]}</div>`;
    });
  });

  grid += '</div>';
  container.innerHTML = grid;
}

/* ── Transfer modal ── */
function showTransfer(partName, alertType) {
  const card = document.getElementById('transfer-card');
  const detail = document.getElementById('transfer-detail-text');

  const messages = {
    imbalanced:   `Proposed: move 50× ${partName} from Tampa Westshore → Orlando Mills`,
    out_of_stock: `Reorder recommended: 20× ${partName} via MobileSentrix`,
    low_stock:    `Reorder recommended: 15× ${partName} via MobileSentrix`,
  };

  detail.textContent = messages[alertType] ?? `Action required for ${partName}`;
  card.style.display = 'block';
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ── Region filter ── */
function filterRegion(region) {
  loadAll(region);
}

/* ── Refresh ── */
function refreshData() {
  loadAll(currentRegion);
}

/* ── Notification preview ── */
function toggleClick(el) {
  el.classList.toggle('on');
}

function updatePreview() {
  const name = document.getElementById('sender-name')?.value || 'Fix Wireless';
  const showEta = document.getElementById('toggle-eta')?.classList.contains('on');
  const showReview = document.getElementById('toggle-review')?.classList.contains('on');

  let msg = `Great news! Your iPhone 15 Pro screen repair is complete and ready for pickup.`;
  if (showEta) msg += ` Estimated pickup window: today before 6:00 PM.`;
  msg += ` Show this text at the counter.`;
  if (showReview) msg += ` ⭐ Leave us a review: g.page/fixwireless`;

  document.getElementById('sms-sender').textContent = name;
  document.getElementById('sms-preview-text').textContent = msg;
}

function saveNotif() {
  const toast = document.getElementById('saved-toast');
  toast.style.display = 'inline';
  setTimeout(() => toast.style.display = 'none', 2500);
}

/* ── API status bar ── */
function updateApiBar(state) {
  const el = document.getElementById('api-status');
  const ts = document.getElementById('last-fetch');
  if (state === 'loading') {
    el.textContent = '○ Connecting to sandbox…';
  } else {
    const marker = apiConnected ? '● Connected' : '○ Sandbox unreachable — showing mock data';
    el.textContent = `${marker} · api.repairq-sandbox.servicecentral.com/v2`;
    ts.textContent = `Last fetched: ${new Date().toLocaleTimeString()}`;
  }
}

/* ── Helpers ── */
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

/* ── Init ── */
loadAll('all');

// Auto-refresh every 60 seconds
setInterval(() => loadAll(currentRegion), 60000);
