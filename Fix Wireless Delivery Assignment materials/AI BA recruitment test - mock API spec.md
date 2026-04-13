# RepairQ Multi-Location API (Mock Specification)

**Base URL:** `https://api.repairq-sandbox.servicecentral.com/v2`
**Authentication:** Bearer token (provided in sandbox credentials)
**Rate Limit:** 100 requests/minute
**Format:** JSON

---

## Authentication

```
POST /auth/token
```

**Request Body:**
```json
{
  "client_id": "your_client_id",
  "client_secret": "your_client_secret"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

---

## Locations

### List All Locations

```
GET /locations
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `region` | string | Filter by region (e.g., "southeast", "midwest") |
| `state` | string | Filter by US state code (e.g., "FL", "GA") |
| `page` | integer | Page number (default: 1) |
| `per_page` | integer | Results per page (default: 25, max: 100) |

**Response:**
```json
{
  "data": [
    {
      "id": "loc_001",
      "name": "Fix Wireless - Atlanta Midtown",
      "store_number": "QF-ATL-001",
      "address": {
        "street": "123 Peachtree St NE",
        "city": "Atlanta",
        "state": "GA",
        "zip": "30309"
      },
      "region": "southeast",
      "status": "active",
      "timezone": "America/New_York",
      "owner": {
        "id": "usr_sarah_kim",
        "name": "Sarah Kim"
      },
      "created_at": "2023-06-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 25,
    "total": 62,
    "total_pages": 3
  }
}
```

### Get Location Details

```
GET /locations/{location_id}
```

**Response:** Single location object (same schema as list item).

---

## Repair Tickets

### List Tickets

```
GET /tickets
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `location_id` | string | Filter by location |
| `status` | string | Filter by status: `checked_in`, `diagnosing`, `waiting_parts`, `in_repair`, `ready_pickup`, `completed`, `cancelled` |
| `created_after` | datetime | ISO 8601 timestamp |
| `created_before` | datetime | ISO 8601 timestamp |
| `sort` | string | Sort field: `created_at`, `updated_at`, `status` |
| `order` | string | `asc` or `desc` |
| `page` | integer | Page number |
| `per_page` | integer | Results per page (max: 100) |

**Response:**
```json
{
  "data": [
    {
      "id": "tkt_20240115_001",
      "ticket_number": "RQ-2024-00451",
      "location_id": "loc_001",
      "status": "in_repair",
      "priority": "normal",
      "device": {
        "type": "smartphone",
        "manufacturer": "Apple",
        "model": "iPhone 15 Pro",
        "serial_number": "DNXXXXXX",
        "imei": "35XXXXXXXXXXXXX"
      },
      "repair_type": {
        "id": "rt_screen_replacement",
        "name": "Screen Replacement",
        "category": "hardware",
        "estimated_duration_minutes": 45
      },
      "customer": {
        "id": "cust_00982",
        "name": "Jane Doe",
        "email": "jane.doe@example.com",
        "phone": "+14045551234"
      },
      "technician": {
        "id": "tech_mike_r",
        "name": "Mike Rodriguez"
      },
      "parts_used": [
        {
          "part_id": "prt_iph15pro_screen_oem",
          "name": "iPhone 15 Pro Screen Assembly (OEM)",
          "quantity": 1,
          "unit_cost": 89.99
        }
      ],
      "pricing": {
        "labor": 79.99,
        "parts": 89.99,
        "tax": 14.45,
        "discount": 0.00,
        "total": 184.43
      },
      "timestamps": {
        "created_at": "2024-01-15T09:23:00Z",
        "checked_in_at": "2024-01-15T09:23:00Z",
        "diagnosis_started_at": "2024-01-15T09:45:00Z",
        "repair_started_at": "2024-01-15T10:10:00Z",
        "completed_at": null,
        "picked_up_at": null
      },
      "notes": "Customer reports cracked screen from drop. No water damage visible."
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 25,
    "total": 847,
    "total_pages": 34
  }
}
```

### Get Ticket Details

```
GET /tickets/{ticket_id}
```

### Get Ticket Summary (Aggregated)

```
GET /tickets/summary
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `location_id` | string | Filter by location (omit for all locations) |
| `region` | string | Filter by region |
| `period` | string | `today`, `week`, `month`, `custom` |
| `start_date` | date | Required if period is `custom` |
| `end_date` | date | Required if period is `custom` |
| `group_by` | string | `location`, `status`, `repair_type`, `technician` |

**Response:**
```json
{
  "data": {
    "period": "week",
    "start_date": "2024-01-08",
    "end_date": "2024-01-14",
    "total_tickets": 1842,
    "groups": [
      {
        "group_key": "loc_001",
        "group_label": "Fix Wireless - Atlanta Midtown",
        "ticket_count": 47,
        "avg_turnaround_hours": 26.3,
        "tickets_by_status": {
          "checked_in": 3,
          "diagnosing": 2,
          "waiting_parts": 5,
          "in_repair": 8,
          "ready_pickup": 4,
          "completed": 23,
          "cancelled": 2
        },
        "revenue": {
          "labor": 3245.50,
          "parts": 4120.00,
          "total": 7879.27
        }
      }
    ]
  }
}
```

---

## Parts Inventory

### List Parts (by Location)

```
GET /locations/{location_id}/parts
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search by part name or SKU |
| `category` | string | `screen`, `battery`, `camera`, `charging_port`, `back_glass`, `other` |
| `manufacturer` | string | Filter by device manufacturer |
| `in_stock` | boolean | Filter to only parts currently in stock |
| `low_stock` | boolean | Filter to parts below reorder threshold |
| `page` | integer | Page number |
| `per_page` | integer | Results per page (max: 100) |

**Response:**
```json
{
  "data": [
    {
      "part_id": "prt_iph15pro_screen_oem",
      "sku": "SCR-APL-15P-OEM",
      "name": "iPhone 15 Pro Screen Assembly (OEM)",
      "category": "screen",
      "manufacturer_compatibility": ["Apple"],
      "model_compatibility": ["iPhone 15 Pro", "iPhone 15 Pro Max"],
      "variant": "OEM",
      "unit_cost": 89.99,
      "retail_price": 169.99,
      "quantity_on_hand": 12,
      "reorder_threshold": 5,
      "reorder_quantity": 20,
      "last_reorder_date": "2024-01-03T00:00:00Z",
      "avg_monthly_usage": 18,
      "supplier": {
        "id": "sup_mobilesentrix",
        "name": "MobileSentrix"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 25,
    "total": 312,
    "total_pages": 13
  }
}
```

### Get Parts Inventory Across Locations

```
GET /parts/{part_id}/inventory
```

**Response:**
```json
{
  "data": {
    "part_id": "prt_iph15pro_screen_oem",
    "sku": "SCR-APL-15P-OEM",
    "name": "iPhone 15 Pro Screen Assembly (OEM)",
    "total_quantity": 347,
    "locations": [
      {
        "location_id": "loc_001",
        "location_name": "Fix Wireless - Atlanta Midtown",
        "quantity_on_hand": 12,
        "reorder_threshold": 5,
        "avg_monthly_usage": 18,
        "days_of_stock": 20,
        "status": "adequate"
      },
      {
        "location_id": "loc_015",
        "location_name": "Fix Wireless - Tampa Westshore",
        "quantity_on_hand": 203,
        "reorder_threshold": 10,
        "avg_monthly_usage": 15,
        "days_of_stock": 406,
        "status": "overstocked"
      },
      {
        "location_id": "loc_016",
        "location_name": "Fix Wireless - Orlando Mills",
        "quantity_on_hand": 0,
        "reorder_threshold": 8,
        "avg_monthly_usage": 22,
        "days_of_stock": 0,
        "status": "out_of_stock"
      }
    ]
  }
}
```

### Get Parts Summary (Aggregated)

```
GET /parts/summary
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Filter by part category |
| `alert_only` | boolean | Only return parts with stock alerts |
| `region` | string | Filter by region |

**Response:**
```json
{
  "data": {
    "total_skus": 312,
    "total_inventory_value": 287450.00,
    "alerts": {
      "out_of_stock": 23,
      "low_stock": 45,
      "overstocked": 18
    },
    "parts": [
      {
        "part_id": "prt_iph15pro_screen_oem",
        "sku": "SCR-APL-15P-OEM",
        "name": "iPhone 15 Pro Screen Assembly (OEM)",
        "total_quantity": 347,
        "locations_out_of_stock": 3,
        "locations_low_stock": 7,
        "locations_overstocked": 2,
        "imbalance_score": 8.7
      }
    ]
  }
}
```

---

## Repair Types

### List Repair Types

```
GET /repair-types
```

**Response:**
```json
{
  "data": [
    {
      "id": "rt_screen_replacement",
      "name": "Screen Replacement",
      "category": "hardware",
      "estimated_duration_minutes": 45,
      "avg_actual_duration_minutes": 52,
      "device_types": ["smartphone", "tablet"],
      "requires_parts": true,
      "common_parts": ["prt_iph15pro_screen_oem", "prt_iph15_screen_oem", "prt_sam_s24_screen"]
    },
    {
      "id": "rt_battery_swap",
      "name": "Battery Replacement",
      "category": "hardware",
      "estimated_duration_minutes": 30,
      "avg_actual_duration_minutes": 28,
      "device_types": ["smartphone", "tablet", "laptop"],
      "requires_parts": true,
      "common_parts": ["prt_iph15pro_battery", "prt_iph14_battery"]
    },
    {
      "id": "rt_water_damage",
      "name": "Water Damage Diagnostic",
      "category": "diagnostic",
      "estimated_duration_minutes": 60,
      "avg_actual_duration_minutes": 95,
      "device_types": ["smartphone"],
      "requires_parts": false,
      "common_parts": []
    },
    {
      "id": "rt_charging_port",
      "name": "Charging Port Repair",
      "category": "hardware",
      "estimated_duration_minutes": 40,
      "avg_actual_duration_minutes": 38,
      "device_types": ["smartphone", "tablet"],
      "requires_parts": true,
      "common_parts": ["prt_iph15_cport", "prt_sam_s24_cport"]
    },
    {
      "id": "rt_software_reset",
      "name": "Factory Reset / Software Restore",
      "category": "software",
      "estimated_duration_minutes": 20,
      "avg_actual_duration_minutes": 25,
      "device_types": ["smartphone", "tablet", "laptop"],
      "requires_parts": false,
      "common_parts": []
    }
  ]
}
```

---

## Sandbox Data

The sandbox environment contains pre-populated data:

| Entity | Count | Notes |
|--------|-------|-------|
| Locations | 62 | Across 14 US states, 4 regions |
| Active tickets | ~850 | Various statuses |
| Completed tickets (90 days) | ~24,000 | Historical data for reporting |
| Parts SKUs | 312 | Mix of OEM and aftermarket |
| Technicians | 124 | 2 per location average |
| Customers | ~18,000 | Anonymised |

**Regions:** `southeast`, `northeast`, `midwest`, `west`

**Sandbox Credentials:**
```
Client ID: sandbox_fixwireless_001
Client Secret: sk_sandbox_qf_2024_test
Base URL: https://api.repairq-sandbox.servicecentral.com/v2
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "The 'status' parameter must be one of: checked_in, diagnosing, waiting_parts, in_repair, ready_pickup, completed, cancelled",
    "details": {
      "parameter": "status",
      "provided": "open",
      "allowed": ["checked_in", "diagnosing", "waiting_parts", "in_repair", "ready_pickup", "completed", "cancelled"]
    }
  }
}
```

**Common Error Codes:**

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or expired token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `INVALID_PARAMETER` | 400 | Invalid query parameter |
| `RATE_LIMITED` | 429 | Rate limit exceeded |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Notes

- All timestamps are UTC (ISO 8601 format)
- Pagination is cursor-based for large result sets
- The sandbox resets nightly at 03:00 UTC
- Webhook support is not available in this API version
- Transfer orders between locations are not supported in this API version

