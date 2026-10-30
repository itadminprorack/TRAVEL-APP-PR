# ProRack Move — UI transformation

## Shared design system

`src/premium.css` supplies the shared warm-white canvas, navy typography, cobalt action color, restrained orange emphasis, elevation, borders, spacing, focus states, tactile press depth and responsive layouts. No runtime dependencies or external fonts were added. Page entrances use short opacity/transform animations; reduced motion disables animations and transitions.

## Screen-by-screen changes

| Screen / state | Changes |
|---|---|
| Welcome | Original bus/train/aircraft illustration, stronger headline hierarchy, tactile persona cards, clear selected states and entry action |
| Employee home | Spacious journey hero, optimized local campus art, clearer metrics, itinerary information and dashboard guide |
| New request | Illustrated purpose tiles, clear four-step progress, larger fields, local location suggestions, emergency styling, accessibility-notes guidance and review confirmation artwork |
| My requests | View-local search, result count, status filters, desktop list layout and mobile request cards |
| Request details | Desktop drawer, mobile bottom sheet, readable route header, requested arrival, stored pickup instructions and informative exceptional-status progress |
| Trips | Dedicated transport artwork, clearer plan identity, practical travel details and itinerary action |
| Admin overview | Larger KPI hierarchy, focused review queue, dimensional route graphic and consistent activity / suggestion cards |
| Admin requests | Clearer headers, rows, urgent chips, keyboard-focusable labeled horizontal table region and larger row actions |
| Route planner | Cohesive map illustration plus actual selected pickup locations ordered by requested departure; reasons, passenger counts and manual road-verification guidance remain explicit |
| Allocation / edit | Six original vehicle illustrations, accessible radio selections, clear capacity / departure / provider fields and preserved validation |
| People / profile | Layered profile cards, readable role indicators, consistent metadata, profile navigation and mobile access |
| Reports | Analytics illustration, consistent KPI and chart styling, readable labels, proportional bars and activity feed |
| Settings / guide | Consistent cards, clear local storage / reset controls, travel-planning artwork and readable help steps |
| Notifications | Larger readable cards, unread emphasis, dedicated empty-state art and accessible expanded state |
| Guided tour | Consistent panel, readable step content, larger controls and reduced-motion support |
| Itinerary | Retained clean A4 print treatment and explicit demo-only labeling; preview receives shared dialog styling |
| Feedback / loading | Original success illustration, alert/status live feedback, illustrated empty states and lightweight initial HTML loading skeleton |
| Navigation / dialogs | Mobile Admin More menu, skip link, current-page semantics, selected-state semantics, modal focus trap, opener restoration and inert background |

## Assets and checkpoint

15 new original SVG files, the existing generated campus hero, and the shared route illustration are integrated. See [ASSET_MANIFEST.md](ASSET_MANIFEST.md) for dimensions, placements and optional raster prompts.

The pre-transformation source checkpoint is `backups/before-ui-transformation-2026-10-29/`. Before/after evidence and the browser QA report are in `preview/ui-transformation/`.

## Verification

- `npm.cmd run verify`: all 14 unit tests and JavaScript syntax checks passed.
- `npm.cmd run qa:flows`: existing browserless request/review/allocation flow passed.
- `scripts/ui_flows.mjs`: 12 browser interaction groups passed, including submission, search, draft/resume, emergency validation, allocation/editing, notification read state, clarification/rejection, people creation, CSV, guided tour, reset and persistence.
- `scripts/ui_qa.mjs`: 165 rendered screen/state checks at 360, 390, 768, 1024 and 1440px; no page overflow, failed images or console errors.
- 66 automated axe WCAG A/AA audits passed with no detected violations. These automated checks are not a full accessibility certification; physical Android and manual screen-reader testing were not performed.
- Modal focus capture, keyboard trapping, opener restoration, reduced-motion behavior and A4 print visibility passed in Chrome.
- `npm.cmd run build` passed. The release contains the current UI source, all 15 SVG assets and the optimized campus image. SVG XML and source/release asset equality checks passed.
- The core logic, storage and seed-data modules are byte-for-byte identical to the checkpoint.

Before/after screenshots: `preview/ui-transformation/before/` and `preview/ui-transformation/after/`. Machine-readable results: `preview/ui-transformation/qa-report.json` and `flow-report.json`. Print sample: `preview/ui-transformation/itinerary-print.pdf`. The complete illustration collection can be viewed at `http://localhost:5173/preview/ui-transformation/asset-gallery.html`.

The optional browser scripts use externally supplied Playwright and axe modules via `PLAYWRIGHT_MODULE` and `AXE_MODULE`, keeping the application itself dependency-free. In this workspace, development-only tooling is cached under `output/npm-cache/`; it is excluded from the release.

Ruflo diff-risk was called, but the workspace has no Git repository and its zero-change response is not useful evidence. Actual source/checkpoint comparison and browser regression tests were used for the scope review.

The local storage keys and schemas remain unchanged. `logic.js`, `store.js` and `data.js` retain the original request, grouping, capacity, allocation and persistence behavior.

## Welcome background follow-up

Replaced the small welcome SVG placement with a generated campus travel background featuring a bus, train and aircraft. Added responsive cropping and legibility overlays without changing the role-selection flow. Targeted checks passed at 360, 390, 685, 768, 1024 and 1440px. See [generation details](docs/WELCOME_BACKGROUND.md).

## Generated illustration replacement - 30 October 2026

Replaced all 14 shared spot/transport illustration references with newly generated transparent PNGs and replaced the inline route-scene SVG with a generated campus-route JPEG. This updates all six transport types, purpose tiles, request planning, review, team visuals, reports, success feedback, notifications and empty states. The complete set contains 15 distinct new images, generated with the built-in imagegen tool.

Runtime assets: `src/assets/generated/`. Original masters: `output/imagegen/v3/`. Exact prompts: [docs/GENERATED_ASSETS_V3.md](docs/GENERATED_ASSETS_V3.md). Updated gallery: `preview/ui-transformation/asset-gallery.html` and `preview/generated-art-v3-gallery.png`.

Verified after integration: 14 unit tests, browserless travel-flow QA, all 12 browser interaction groups, 165 rendered state/width checks, 66 automated WCAG A/AA audits, and the static build. No page overflow, broken images, JavaScript console errors or automated accessibility violations were detected. All 15 generated assets match the static release; all 14 PNG spot images retain transparent backgrounds. Core logic, persistence and seed-data modules are unchanged. Physical-device and manual screen-reader testing were not performed in this pass.

## Optional arrival and 12-hour scheduling

- Added optional required-arrival date and time to travel requests, review, request details, allocation summaries, itineraries and CSV exports. A time-only deadline uses the departure date.
- Departure, return and allocation times use hour/minute selectors with explicit AM/PM choices. Internal times retain HH:mm storage for compatibility.
- Rejects invalid dates, partial times and deadlines before departure; supports overnight arrival.

## Clock-style time picker

All departure, arrival, return and allocation time fields now open a shared blue clock dialog with large hour/minute inputs, an analog dial, AM/PM buttons, Cancel and OK. Optional fields also offer Clear. Exact minutes can be typed; Escape cancels without saving. Native modal focus handling supports use within Admin allocation dialogs. Canonical HH:mm storage is preserved.
