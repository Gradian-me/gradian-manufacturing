# Data Dictionary

All demo data lives under `/data` and is consumed exclusively through domain loaders (`src/lib/data/*`).

## Catalog (`/data/catalog`)

| File | Description | Key Fields |
| ---- | ----------- | ---------- |
| `items.json` | Material/component master list | `id`, `sku`, `name`, `type`, `unit`, `standard_cost` |
| `equipment.json` | Equipment and machine rates | `id`, `code`, `name`, `hourly_rate`, capacity fields, `work_center_id` |
| `labor.json` | Labor grades and hourly rates | `id`, `grade`, `hourly_rate` |
| `workcenters.json` | Work center definitions | `id`, `code`, `name` |

## Process (`/data/process`)

| File | Description | Key Fields |
| ---- | ----------- | ---------- |
| `templates.json` | Device templates with BOM, routing, costing | `id`, `status`, `version`, `customer_fit[]`, nested `bom[]`, `routing[]`, `costing` |
| `routing.json` | Global routing step definitions | `id`, `default_duration_min`, `work_center_id`, `labor_grade_id`, `description`, `resource_notes[]` |
| `opc.json` | Operation Process Chart definition | `groups[]` (phase metadata), `nodes[]` (operations), `edges[]` (relationships) |

## Manufacturing (`/data/manufacturing`)

| File | Description | Key Fields |
| ---- | ----------- | ---------- |
| `mos.json` | Manufacturing orders with frozen snapshots | `id`, `template_id`, `device_code`, `status`, `priority`, `start_date`, `due_date`, `snapshot.bom[]`, `snapshot.routing[]`, `snapshot.costing` |
| `operations.json` | Execution logs per operation | `operation_id`, `mo_id`, `routing_id`, `status`, `labor_logs[]`, `equipment_logs[]`, `material_issues[]`, `holds[]`, `qa_checks[]` |

## Analytics (`/data/analytics`)

| File | Description | Key Fields |
| ---- | ----------- | ---------- |
| `kpis.json` | KPI cards, chart definitions, filter metadata | `cards[]` (value/delta), `charts` (line/bar/radar configs), `filters` |

## Contracts & Types

- Shared TypeScript interfaces reside under `src/lib/types/**`, mirroring the JSON structure.
- Every `/api/**` route returns `{ data: <payload> }` for consistency with React Query consumers.

## Consumption Rules

1. Data access is **read-only** within the MVP (no writes/mutations).
2. Any new feature must surface data via the library functions (`getCatalogItems`, `getDeviceTemplates`, etc.) before reaching components.
3. When extending JSON structures, update the corresponding type definitions and document the change here.

