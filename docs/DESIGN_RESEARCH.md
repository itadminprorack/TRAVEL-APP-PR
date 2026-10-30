# ProRack Move | Global UI Research & Light-Theme Design Direction

**Version:** 1.0 | **Prepared:** 29 October 2026  
**Purpose:** Design research and an actionable creative brief for Claude Opus 5.5 implementation  
**Status:** Original design recommendation, not a reproduction of a competitor's interface

## 1. Design decision

**Design goal:** Make ProRack's travel application feel as deliberate, premium and tactile as CRED, while retaining the clarity of corporate travel tools and the simplicity required for site workers. **The entire application must use a LIGHT theme. No dark-themed default, admin panel or worker screen.**

**Proposed design name:** ProRack Motion Light (a working name, not approved branding). The aesthetic is clean, premium and functional: warm-white canvas, bright paper-like panels, blue navigation/CTAs, restrained orange highlights, tactile button depth, refined typography and purposeful motion.

**Core philosophy:** CRED-inspired *interaction quality*, Navan/Perk-inspired *travel workflows*, Uber for Business-inspired *Admin controls*, and TripIt-inspired *clear itinerary information*.

## 2. Research method and confidence

This comparison uses official product sites, product documentation and design-system repositories accessed in October 2026. It evaluates visible product capabilities and documented design concepts, not secret product metrics, usability lab outcomes or unverified app-store rankings. The ranking below is **our fit assessment for ProRack**, not a claim of an objective world ranking.

### 2.1 Benchmarks

| Reference | Documented strength | Transfer to ProRack | What NOT to copy |
|---|---|---|---|
| **CRED / NeoPOP** | Official open-source React component system with elevated buttons and fluid animation [D1] | Tactile primary CTA, distinctive card borders, active/pressed feedback | CRED logos, dark theme, ornamental over-animation |
| **Navan** | Corporate travel policies, workflows, multiple travel types, consumer-grade mobile experience [D2] | Request status, role-based policies, manager trip cards | Full consumer booking marketplace in MVP |
| **Perk** | Approval rules by traveler, notification vs approval, group-travel coordination [D3] | Explainable approval status, clearly differentiated approval steps | Complex finance policy builder before business sign-off |
| **Uber for Business** | Central dashboard for ride policies, commute programs, trip reporting [D4] | Admin planning console, location/time boundaries, organized requests | Automatic real-time ride procurement in MVP |
| **TripIt** | Consolidated itineraries, calendar/map views, travel information [D5] | One readable upcoming-trip card and change alerts | Large travel-content feeds, ads or nonessential widgets |
| **WCAG / Apple HIG** | Accessibility contrast/target guidance; optional functional motion [D6-D7] | Field usability, readable cards, reduced-motion handling | Low-contrast "luxury gray" labels, motion-only feedback |

### 2.2 Prioritized inspiration (editorial)

1. **CRED NeoPOP: strongest visual/interaction reference.** NeoPOP Web is available under Apache 2.0, but the project notes its components were optimized for mobile views. For maintainability and differentiation, implement original light-themed components with accessible primitives; evaluate any direct library adoption separately. [D1]
2. **Navan + Perk: strongest travel approval references.** Both describe role/policy-based corporate travel workflows; Perk explicitly distinguishes notifications from approval rules. This is vital so a notification does not masquerade as an approval. [D2-D3]
3. **Uber for Business: strongest Admin dashboard reference.** Route/time restrictions, spend visibility and commute programs demonstrate why the Admin UI needs utility-first controls, not just visual cards. [D4]
4. **TripIt: strongest itinerary hierarchy reference.** One confirmed plan should be easy to scan, with transportation details grouped logically. [D5]

## 3. Visual system: premium light, never dark

### 3.1 Semantic colors

| Token | Proposed HEX | Where to use |
|---|---|---|
| `canvas` | `#F8FAFC` | Entire app backgrounds |
| `surface` | `#FFFFFF` | Elevated cards, sheets, forms |
| `text.primary` | `#162033` | Main headings and body text |
| `text.secondary` | `#475569` | Subheadings and metadata |
| `brand.primary` | `#1D4ED8` | Primary CTA, active navigation, links |
| `brand.orangeAccent` | `#F97316` | Decorative rule, icon accents, selected highlights |
| `brand.orangeText` | `#C2410C` | Small orange text on white where contrast needed |
| `stroke` | `#E2E8F0` | Subtle card borders and dividers |
| `success` | `#166534` | Confirmed status text |
| `danger` | `#B91C1C` | Error text and destructive notices |

**Contrast note:** on white, the proposed blue `#1D4ED8` has approximately 6.7:1 contrast, dark text `#162033` approximately 16.3:1, and orange text `#C2410C` approximately 5.2:1. Bright decorative orange `#F97316` is only approximately 2.8:1 on white and **must not be used for normal small text**. Contrast tests based on the WCAG relative-luminance formula. [D6]

Use **white and off-white in all screen backgrounds**. Navy is a text or thin graphic accent, **not a dark app theme**. Prefer airy layout rather than layered gray rectangles.

### 3.2 Type and spacing

- Headline typeface: **Manrope** or **Plus Jakarta Sans**; body: **Inter** or equivalent readable sans-serif. All licenses and bundle files must be checked and sourced properly.
- Employee mobile title: 26-30 px, 700 weight. Section title: 18-20 px. Body: 15-16 px. Supporting text: 13-14 px at strong contrast.
- Admin desktop title: 24-30 px, KPI number 26-32 px, table text 13-14 px, action button label 14-15 px.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48 px; 8 px baseline rhythm.
- Mobile page padding: 16-20 px; Admin content max width near 1440 px with responsive gutters.
- Card radius: 16-20 px for feature cards; controls 10-14 px; compact data table 10-12 px.
- Shadows: restrained two-layer shadows for raised controls only; never a gray blur behind every text block.

### 3.3 NeoPOP-inspired tactile behavior

**Primary button:** white/blue elevated face with a deliberate darker offset edge. Pressing compresses depth by 2-3 px, transitions within 120-180 ms. The button remains readable and keyboard-accessible, not an exact CRED clone.

**Travel mode card:** icon and label plus status, with small depth change on selection. Show only when relevant; standard employees must not be shown a transport preference selector.

**Success moment:** a brief checkmark and a clear request ID/next step; avoid full-screen confetti or a mandatory celebration before Admin needs the information.

**Admin prioritization:** status chips and rows use subtle color + text/icon, not color-only status. Emergency requests can have a visible orange bar and explicit label, never blinking red.

**Motion principle:** use subtle stateful feedback, never decorative continuous movement. Respect `prefers-reduced-motion`. [D7]

## 4. Information architecture (worker and Admin are different products)

### 4.1 Employee mobile (bottom navigation)

```text
[Home]     [My Travel]     [Help/Profile]

Home: greeting + upcoming trip + giant "Plan travel" CTA
Plan travel: route -> dates/purpose -> details -> review/submit
My Travel: upcoming/requests/history; status and booking details
Help/Profile: coordinator contact, account, accessibility, logout
```

**No desktop-style dashboard for workers.** The main action must be apparent within one glance and completed by a first-time user with minimal training.

### 4.2 Admin desktop/tablet (left navigation)

```text
Overview
Travel requests  [All / Emergency / Needs action / Planned]
Plan & group     [List + optional map + selected items]
Transport plans [Vehicle/ticket allocations]
Bookings         [Manual refs and documents]
Reports          [Requests, routes, utilization]
Users & access   [Admin only]
Settings         [Policy, sites, vehicles]
```

Admin needs operational density: table/list actions, bulk controls, saved filters and clear errors. Beautiful cards can summarize workload, but **the actionable queue matters more than decorative graphs**.

## 5. Priority screen-by-screen design specifications

### Screen 01: Sign-in (mobile)

- White background, concise ProRack brand mark, short description "Travel planned. Teams moving."
- Primary Microsoft sign-in for employees with Microsoft 365, secondary **Use Admin-provided account** for workers.
- No misleading password field under the Microsoft option. Plain language assistance for temporary-password activation.
- Accessible loading, error and recovery messages; don't expose whether a private user exists.

### Screen 02: Employee home

- Top: light header with greeting, profile/menu and succinct today context.
- Hero card: **Upcoming journey** when assigned, else gentle empty state.
- Primary dimensional blue CTA: **Plan travel**; single prominent action.
- Below: "My recent requests" with 2-3 concise statuses; no long form or AI chat at home.
- Optional illustration at bottom using original ChatGPT-generated assets, not a full-screen image that pushes the CTA below fold.

### Screen 03: Submit travel request

- Step 1: purpose + planned/emergency, travel category (auto-filled role).
- Step 2: origin/pickup, destination/site, departure date/time, required arrival; optional return.
- Step 3: traveler count/roster (if authorized), project/department, helpful constraints; manager-only mode preference.
- Step 4: review and submit. Edit links on each section, clearly visible submission success.
- Use strong input labels, calendar pickers, search suggestions, and progressively disclosed fields.

### Screen 04: My trip / itinerary

- Overall confirmed status, origin-to-destination line, travel date, departure and pickup/boarding location.
- Provider, vehicle/train/flight identifier **only when actually confirmed**, plus coordinator contact.
- Booking reference and authorized attachment accessible with permission.
- Timeline of events: Requested -> Approved -> Assigned -> Confirmed/Departing -> Completed.

### Screen 05: Admin overview

- Top action line: Emergency requests, Unassigned, Trips today, Seats committed.
- One clearly prioritized queue: actionable rows with requester category, route, when, passengers, purpose and SLA age.
- Tertiary: groupable-route hints; no overwhelming AI prose.
- Quick action: **Review request** or **Plan transport**, with visible approval state.

### Screen 06: Grouping workspace

- Split layout on wide screens: request list with multi-select left; optional route map and proposed vehicle right.
- Explain grouping: "3 travelers, same site, arrival within 30 minutes, route detour estimate 12 min" only when estimates are grounded.
- Controls: add/remove person, reorder stops, choose available vehicle, see seat utilization, confirm.
- If geocoding fails, show manual pickup grouping rather than blocking all allocation.
- Provide explicit "Not compatible" reasons if time, capacity or safety rules prevent grouping.

### Screen 07: Group travel (50 workers)

- Bulk roster intake: CSV/template or Admin-selected users.
- Summary: 50 passengers, same destination, proposed date; editable roster.
- Suggested mode (e.g., rail) marked **planning suggestion, not inventory or confirmed booking**.
- Admin records verified ticket/group booking reference, attaches file and confirms notices.

### Screen 08: Admin user provisioning

- Create worker with scoped category/site and unique sign-in ID; activation/reset through approved auth provider.
- No plaintext password persistence or password display in logs.
- Revoking access removes future data access, preserving required audit history.

## 6. Component system and token rules

| Component | Behavior / constraints |
|---|---|
| `TravelHeroCard` | One prominent upcoming journey; never hides actionable CTA |
| `DepthButton` | Primary dimensional control, press state, keyboard focus ring |
| `StatusPill` | Text + color + icon, consistent labels and transitions |
| `RouteSummary` | Origin/destination with time zones; avoid deceptive straight-line routes |
| `TravelRequestStepper` | Draft persistence, inline validation, progress indicator |
| `DateTimeField` | Accessible mobile picker, timezone and overnight handling |
| `ModePreference` | Render only for managers; server checks role too |
| `AdminRequestTable` | Filterable, bulk selection, accessible row action menu |
| `GroupingExplanation` | Deterministic rationale and estimated constraints |
| `SeatCapacityMeter` | Actual occupied/available seats; prevent overbooking |
| `NotificationCenter` | Read/Unread and delivered/failed state semantics |
| `ApprovalTimeline` | Decision role, date and comment with permissioned visibility |

## 7. Accessibility and real-world usability

- Target WCAG 2.2 AA for the web app. Normal text contrast >=4.5:1, large text >=3:1, focus indicators visible; never rely only on color. [D6]
- Make high-frequency mobile controls ~44-48 px high even though WCAG minimum target criteria can be smaller with sufficient spacing.
- Prefer one simple question per screen for worker-facing forms; use input autocomplete and obvious inline validation.
- Handle bright sunlight, weak networks, older devices, zoomed text, and screen-reader announcements.
- Provide reduced-motion alternatives and no animation-only information. [D7]
- Use editable text locations when location services are unavailable; never demand continuous background GPS.
- Keep local-account access clear; a user without Microsoft 365 must still receive in-app status.

## 8. Do / do not: how to remain premium without losing speed

| Do | Do not |
|---|---|
| Use light canvases and ample breathing room | Use black, charcoal or navy page backgrounds |
| Apply NeoPOP-style depth to a few primary actions | Add 3D shadows to every field/card |
| Prioritize departure information, status and purpose | Add reward-style gamification or unrelated widgets |
| Preserve standard input semantics and accessibility | Replace form fields with animations or image text |
| Use purposeful 120-240ms feedback | Animate every row on load / delayed clicks |
| Present AI grouping as a proposal with reason | Auto-book tickets or imply prices are verified |
| Keep Admin list dense, sortable and bulk-action friendly | Build a consumer homepage for an operational coordinator |
| Use ProRack original branding | Copy CRED assets, brand or screen exact layouts |

## 9. ChatGPT image generation: original asset briefs

**Use ChatGPT image generation for static decorative assets only**, not live functional maps, readable dynamic text, booking schedules, UI components or logo reproductions. Asset production should occur after brand approval. Keep visuals on light/off-white backgrounds, consistent perspective, and sufficient whitespace.

| Asset | Recommended use | Creative direction |
|---|---|---|
| Light mobility hero | Employee home empty state | Premium editorial illustration of modern corporate shuttle, subtle industrial campus cues; warm white ground, tiny blue/orange accents; no people identifiable |
| Transit modes mini set | Trip/transport cards | Matching 3D-isometric van, bus, rail coach, airplane and ferry on transparent/white backgrounds; same camera and lighting |
| Route cluster concept | Admin empty state | Simple abstract pickup nodes joining one route to an industrial site, no geographic claims, no literal place labels |
| Booking confirmed scene | Trip success card | Elegant paper-ticket motif, geometric line/path and small luggage element, celebratory but minimal |
| Emergency support | Urgent travel empty/help state | Clear illustrated phone + transport coordinator support motif, not alarmist red siren imagery |

### 9.1 Reusable image generation prompt template

> Create an original premium editorial illustration for an enterprise employee travel management app called ProRack Move. LIGHT-THEME ONLY: white or very pale warm gray background, refined soft studio lighting, subtle dimensional depth, tasteful cobalt-blue and muted-orange accents. Subject: [specific approved asset]. Minimal and professional, realistic proportions, understated shadow, generous negative space, coherent perspective and immaculate edges. No brands or logos, no text, no UI screenshots, no license plates, no recognizable real people, no dark background. Output as a clean usable app asset with a composition appropriate for [mobile card / empty state / splash].

### 9.2 Asset production workflow

1. Generate one master visual direction and obtain stakeholder approval.
2. Generate each asset as a variant of the approved perspective and palette; preserve visual consistency.
3. Export high-resolution master and web-friendly responsive derivatives; generate transparent variant only when needed.
4. Name and store outputs in the **company-owned** asset library, record approvals and usage context.
5. Check asset legibility over white, compression size, ALT text and mobile display before commit.

## 10. Recommended order of UI implementation in Claude

| Order | Build | Design quality gate |
|---|---|---|
| 1 | Tokens and original light UI primitives | Consistency, focus states, accessibility |
| 2 | Sign-in + employee home | Two login paths clearly represented |
| 3 | Travel request wizard | Worker can complete without training |
| 4 | My Travel + itinerary | Status and next action visible instantly |
| 5 | Admin overview and request queue | Admin can handle 50+ rows efficiently |
| 6 | Grouping + allocation | Explainable, safe multi-select and capacity |
| 7 | Animation/detail polish | No over-animation, reduced-motion passing |
| 8 | Real assets and final QA | Original assets, low bundle impact, light-only |

## 11. UI research references (official sources)

- [D1] CRED NeoPOP Web, features and Apache 2.0 license: https://github.com/CRED-CLUB/neopop-web
- [D2] Navan for Travel Managers: https://navan.com/solutions/travel-managers
- [D3] Perk Travel Approval Processes: https://support.perk.com/hc/en-us/articles/21925996266524-Travel-approval-processes-in-Perk
- [D4] Uber for Business (India): https://www.uber.com/in/en/business/
- [D5] TripIt features: https://help.tripit.com/en/support/solutions/articles/103000063396-tripit-or-tripit-pro-
- [D6] WCAG 2.2 text contrast and target size: https://www.w3.org/TR/WCAG22/
- [D7] Apple Human Interface Guidelines - Motion: https://developer.apple.com/design/human-interface-guidelines/motion

**Bottom line:** not a dark CRED clone; an **original, light, tactile, high-trust corporate travel experience** that remains effortless for workers and operationally capable for Admin.
