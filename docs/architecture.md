# Gradian Manufacturing MVP — Architecture Overview

## Frontend

- **Next.js App Router (TypeScript)** — Feature-first directory structure (`src/app`, `src/features`, `src/components`).
- **UI** — Tailwind CSS with shadcn/ui primitives; light theme with violet accent palette.
- **State & Data**  
  - `@tanstack/react-query` powers client-side caching for all `/api` requests.  
  - `zustand` persists sidebar layout state across sessions.
- **Visualization**  
  - `echarts` renders responsive KPI dashboards.  
  - `cytoscape.js` with the `cose-bilkent` layout drives the OPC viewer, including compound nodes, toolbar controls, and metadata drawer.

## Backend (within Next.js)

- **API Routes** under `src/app/api/*` expose read-only REST endpoints for each domain.
- **Domain Services** in `src/lib/data/*` form the data-access layer, reading JSON from `/data/**`.
- **Types**: Shared interfaces live in `src/lib/types/*`, aligned with the JSON contracts.

## Domain Modules

| Domain           | Responsibilities | Key Locations |
| ---------------- | ---------------- | ------------- |
| Catalog          | Master data for items, equipment, labor, work centers | `src/features/catalog`, `/data/catalog/*.json` |
| Process Design   | Device templates, routing, OPC graph | `src/features/process-design`, `/data/process/*.json` |
| Manufacturing    | Manufacturing orders, execution logs | `src/features/manufacturing`, `/data/manufacturing/*.json` |
| Costing          | Standard cost snapshots embedded in templates/MOs | `src/lib/types/process.ts`, JSON snapshot fields |
| Analytics        | Dashboard KPIs, filters, saved view state | `src/features/analytics`, `/data/analytics/kpis.json` |
| Administration   | Master data review & (future) CRUD | `src/app/admin` |

## Layout & Responsiveness

- `AppShell` composes the persistent header, sidebar, and content area with safe spacing (`max-w-[120rem]`, padding for mobile).
- Sidebar remembers collapse state (localStorage) and switches to sheet mode on mobile.
- Page-level headers (`PageHeader`) standardize titles, descriptions, and action toolbars.

## Data Flow

1. Pages/components call hooks (e.g., `useAnalytics`, `useOpcGraph`) that fetch from domain-specific API routes.
2. API routes call domain loaders (e.g., `getDeviceTemplates`) which read JSON via `readJsonCached`.
3. Results hydrate client components through React Query, enabling optimistic UI and future mutations.

## Testing & Extensibility

- Placeholder `tests/` directory for future integration tests.
- Data layer isolates file access, enabling rapid swap to Prisma/PostgreSQL post-MVP.
- Service and type separation supports domain-driven refactors and future auth/RBAC integration.

