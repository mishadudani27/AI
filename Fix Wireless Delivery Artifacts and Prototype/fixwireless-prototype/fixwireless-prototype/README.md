# Fix Wireless Ops Dashboard — ServiceCentral Prototype

A functional web prototype built for the Fix Wireless discovery call. Addresses all three
priority pain points identified in the requirements summary:

| # | Pain Point | Panel |
|---|-----------|-------|
| 1 | Cross-location parts inventory visibility | **Parts Inventory** |
| 2 | Real-time ticket aging & turnaround dashboard | **Ticket Aging** |
| 3 | Automated customer repair-status notifications | **Notifications** |

---

## Quick start (no build step required)

This is a pure HTML/CSS/JS app — no Node, no bundler, no install.

### Option A — Open directly in browser
```bash
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

### Option B — Serve locally (recommended to avoid CORS on API calls)
```bash
# Python 3
python3 -m http.server 8080

# Node (if installed)
npx serve .

# Then open: http://localhost:8080
```

---

## API behaviour

The app tries to call the real RepairQ sandbox:
```
Base URL:      https://api.repairq-sandbox.servicecentral.com/v2
Client ID:     sandbox_fixwireless_001
Client Secret: sk_sandbox_qf_2024_test
```

If the sandbox is unreachable (CORS, network, token expired), it automatically falls
back to rich mock data that mirrors the sandbox schema exactly. The API status bar at
the bottom of the screen tells you which mode is active.

---

## File structure

```
fixwireless-prototype/
├── index.html          — Main shell, layout, all three panels
├── src/
│   ├── style.css       — All styles, light/dark mode, responsive
│   ├── api.js          — RepairQ API client + mock data fallback
│   └── app.js          — Rendering logic, event handlers, auto-refresh
└── README.md           — This file
```

---

## Features demonstrated

### Ticket Aging Dashboard
- Live KPI cards: 0–24h / 24–48h / 48+ hrs across all locations
- Per-location breakdown table with colour-coded urgency
- Alert banner for 48+ hr tickets
- Stale tickets drill-down table (fetched from `/tickets?status=in_repair`)
- Region filter (Southeast / Northeast / Midwest / West)
- Auto-refreshes every 60 seconds

### Parts Inventory
- KPI cards: out-of-stock, low-stock, overstocked SKU counts
- Cross-location heat map (parts × locations)
- Sortable parts table with imbalance score and mini stock bars
- "Transfer" / "Reorder" action buttons (Phase 2 preview with explanatory note)
- Fetches from `/parts/summary` and `/parts/{id}/inventory`

### Customer Notifications
- Per-store toggle configuration (maps to RepairQ settings)
- Live SMS preview that updates as toggles change
- ETA field toggle (correctly flagged as Phase 2 dependency)
- Impact estimates (call reduction, counter time freed)
- Onboarding note: feature already exists in RepairQ — Sarah needs config, not build

---

## What is NOT built (by design)

| Not built | Why |
|-----------|-----|
| Inter-store transfer orders | Phase 2; not in API; deferred by customer |
| Estimated completion time engine | Net-new data capture; Phase 2 dependency |
| Single sign-on / multi-location login | On ServiceCentral roadmap already |
| Standalone deep-reporting tool | Data feeds Looker; not a separate product |

---

## Non-functional requirements met

- ✅ **Mobile-responsive** — sidebar collapses to top nav on small screens
- ✅ **SOC2** — confirmed on sidebar footer; no credentials stored client-side
- ✅ **Looker-compatible** — API calls use the same `/v2` endpoints Looker would connect to
- ✅ **Dark mode** — respects `prefers-color-scheme`
- ✅ **No dependencies** — ships with zero npm packages; runs offline with mock data

---

## Next steps for customer review

1. Walk through each panel with Dana, Marcus, and Sarah separately
2. Confirm ticket aging bucket thresholds (48h — or does Marcus want 36h?)
3. Validate heat map column selection (which 5 locations to show by default?)
4. Get sign-off on parts alert definition ("overstocked" = days_of_stock > 90?)
5. Confirm Looker integration pattern with Dana's data team (API vs webhook vs export)
