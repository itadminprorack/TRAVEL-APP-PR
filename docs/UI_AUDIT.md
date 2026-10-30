# UI transformation audit

## Existing application

Dependency-free JavaScript modules, string-rendered views, delegated DOM events and a local Node HTTP server. Navigation is stored in `ui.view`; demo roles and records persist in browser localStorage. No framework migration or runtime dependency is needed.

Business logic: `src/logic.js`. Storage and state mutations: `src/store.js`. Seed records: `src/data.js`. These modules are preserved byte-for-byte during this transformation.

## Screen and state inventory

- Welcome: four persona choices, guided demo, workspace entry.
- Employee: home, four request steps, drafts/resubmission, searchable request history, trips, profile and guide.
- Admin: overview, filtered/searchable requests, route planner, selected traveler group, transport plans, people, reports, settings, request on behalf and guide.
- Dialogs: request detail, status reason, group review, allocation, transport plan, edit allocation, printable itinerary, add person, cancellation and reset confirmation.
- Shared states: notifications, profile switcher, success/error feedback, guided tour, empty lists, desktop sidebar, tablet icon rail and mobile navigation.

## Findings and improvement checklist

- [x] Preserve a local source checkpoint before major edits: `backups/before-ui-transformation-2026-10-29/`.
- [x] Replace inconsistent pale text, dense small labels and uneven component depths with shared tokens and readable labels.
- [x] Make the primary journey action prominent; keep essential trip information grouped.
- [x] Supply a coherent illustration library rather than reusing one image throughout the app.
- [x] Make all Admin routes reachable on mobile through a More menu.
- [x] Add employee request search without changing stored records.
- [x] Make request dialogs keyboard navigable, trap focus, restore opener focus, and provide mobile bottom sheets / desktop request drawers.
- [x] Add real local-location suggestions to route entry and show actual selected pickup locations in the planner.
- [x] Display requested arrival and stored pickup instructions; keep route feasibility and booking limitations explicit.
- [x] Give cancelled, rejected, draft and clarification requests an informative progress state.
- [x] Retain printable output, capacity validation, role-specific preferences, CSV export and browser-local persistence.
- [x] Respect reduced motion and use short opacity/transform transitions.
- [x] Check the rendered UI at 360, 390, 768, 1024 and 1440px; record actual results in `UI_CHANGELOG.md` and `preview/ui-transformation/qa-report.json`.

## Direction

Reviewed the supplied [CRED reference](https://cred.club/) for visual personality and dimensional emphasis. The implementation uses an original light-only system, locally authored assets, ProRack's blue/orange identity, quiet enterprise surfaces and tactile controls. No competitor branding or artwork is included.
