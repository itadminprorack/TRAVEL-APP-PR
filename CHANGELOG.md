# ProRack Move — Changelog

## v1.1.0 — 29 October 2026

- Added interactive seven-step guided stakeholder tour for employee, manager and Admin use cases.
- Added edit action for existing Admin transport plans with status and seat-capacity safeguards.
- Notifies the affected demo traveler and writes an audit event when a plan is revised.
- Added printable itinerary preview marked **DEMO · NOT A TICKET**; no actual booking is implied.
- Added tests for plan edits, authorization, capacity and completed-plan locks.
- Verified responsive desktop and mobile interactions through a local browser test harness.

## v1.0.0 — Initial functional local MVP

- Travel request wizard, demo personas, approvals, deterministic route suggestions and allocations.
- Demo audit history, notifications, reports, CSV export, browser-local data persistence.
