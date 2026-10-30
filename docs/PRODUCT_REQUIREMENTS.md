# ProRack Move | Product Requirements Document (PRD)

**Working title:** ProRack Move (subject to naming approval)  
**Version:** 1.0 | **Prepared:** 29 October 2026  
**Product:** Employee Travel & Transportation Management  
**Document owner:** ProRack Technology | **Business stakeholders:** Administration / HR / department heads  
**Status:** Implementation-ready proposal; policy decisions flagged below

## 1. Executive summary

ProRack needs one mobile-first application through which employees, site engineers, managers, field/client-facing personnel, laborers, and workers can communicate **planned or urgent travel needs** before travel occurs. The Administration team should see demand across locations and dates, consolidate compatible requests, allocate vehicles or organize tickets, and communicate an actionable itinerary to travelers. An AI-assisted planning layer can recommend groupings and travel modes, but **Admin makes the final allocation/booking decision**.

**Confirmed from requirements discussion:** all staff categories are extensible; requests capture advance vs emergency and purpose; land, air, and sea are potential modes; only managers and senior managers can express a preferred mode; everyone else is assigned a mode by Admin; users authenticate via Microsoft 365 where available or Admin-provisioned local credentials; the product must be mobile friendly. Workforce travel, client visits, and large group transfers are covered. **Goods delivery/fleet logistics, travel allowances, and reimbursement are explicitly separate products/workstreams.**

**Product recommendation:** deliver a functional MVP for request intake, role-based authentication, Admin planning, manual allocations, status notifications, and deterministic route-grouping suggestions. Live tickets, automated purchases, and advanced cost optimization should follow as separately authorized integrations.

## 2. Problems, outcomes, and success measures

### 2.1 Current problems

- Requirements arrive through calls, messages, or late notice; Admin lacks a single demand queue.
- Employees traveling on overlapping routes may be assigned separate vehicles unnecessarily.
- Group movements (e.g., 50 people to a site in Bhiwandi) require coordinated, policy-compliant planning.
- Managers' trips require timely booking coordination while workers may lack company Microsoft accounts.
- Travelers have limited visibility into status, departure arrangements, and changes.

### 2.2 Desired outcomes

- Central visibility of travel requirements with no unassigned or forgotten submissions.
- More shared vehicle routes when timing and geography are compatible.
- Faster, documented Admin decisions and clear employee updates.
- A consistent request lifecycle with access controls, evidence, and an audit trail.
- A company-owned technical foundation that can expand to transport vendors and booking APIs.

### 2.3 Proposed MVP measurement targets (validate after baseline)

| Metric | Suggested first target | How measured |
|---|---|---|
| Employee request completion | Median under 2 minutes | Submission funnel telemetry |
| Traceability | 100% submitted requests have owner/status | Database audit and queues |
| Admin handling | 95% of requests triaged within configured SLA | Timestamps by request priority |
| Over-allocation prevention | Zero confirmed vehicle seat overbooking | Allocation validation |
| Grouping transparency | 100% AI suggestions show a reason and override action | UI acceptance tests |
| Notification trace | 100% status changes create a notification record | Notification event log |

## 3. Personas and role boundaries

| Persona | Need | Minimum capability |
|---|---|---|
| Worker / laborer | Tell Admin where/when they must travel | Create/view own requests and allocations; no mode preference |
| Employee / site engineer | Coordinate site travel without calling Admin repeatedly | Create requests, updates, attachments; view status |
| Sales / client-facing employee | Advance client-visit travel arrangements | Request travel and attach visit details |
| Manager / senior manager | Request travel with legitimate mode preference | Same as above plus preferred transport field |
| Travel Admin / coordinator | Organize demand and transport | Triage, group, approve where authorized, allocate and notify |
| Department HOD / Finance (configurable) | Approve travel when policy requires | View and approve assigned requests only |
| System Admin | Manage identities, roles, sites and policy settings | Provision and deactivate accounts, configure organization |

**Rule:** a mode preference is available **only** to designated manager/senior-manager roles. An employee's accessibility or safety need is different from a mode preference and must remain reportable for every role.

## 4. MVP scope and staged roadmap

| Capability | MVP release | Later release |
|---|---|---|
| Microsoft 365 login + Admin-created local accounts | Required | Account automation / HR sync |
| Mobile employee request form + emergency flag | Required | Multi-language / voice entry |
| Company, department, site, destination, reason, dates | Required | Policy templates per site |
| Admin request queue, filters and bulk review | Required | Advanced forecasting |
| Grouping recommendations (same destination/date/route overlap) | Rule-based first | Geospatial optimization + AI narratives |
| Admin allocation: vehicle, ticket, pickup points, capacity | Required | Transport-vendor integrations |
| Trip details, itinerary and notification records | Required | SMS/WhatsApp and push, subject to consent |
| Manual travel booking references (train, flight, road, sea) | Required | Authorized live availability and booking |
| Basic audit logs, reports, exports | Required | BI and cost center integrations |
| Reimbursement, allowances and material logistics | Excluded | Separate scoped products |

## 5. End-to-end user journeys

### Journey A: shared employee pickup

1. Three workers submit planned journeys from Kothur, Shamshabad and Kondapur to a common site for compatible shifts.
2. Admin sees all requests, origin/destination, required arrival, and pickup flexibility; no worker mode-selection field is shown.
3. The app **suggests** a consolidated shuttle only if time windows, road routing and seat capacity are compatible. Sharing a destination alone is insufficient.
4. Admin reviews pickup sequence, capacity and cost indications; selects/edits allocation and confirms.
5. Each worker gets pickup location, time, vehicle identification (if available), coordinator and status.

### Journey B: manager client visit

1. A sales manager submits a planned Mumbai client visit with dates, purpose and preferred mode (e.g., flight).
2. Admin reviews travel constraints, applicable policy and approvals, then records booking details or requests clarification.
3. If a flight is selected, Admin manually books through an authorized channel in MVP and adds the reference/itinerary.
4. The manager sees confirmations and updates. Preferred mode is **a request**, not a booking guarantee.

### Journey C: 50 workers to Bhiwandi

1. An authorized requester or Admin submits a group movement with 50 named travelers or a verified roster, dates and destination.
2. The app proposes a group-trip plan (e.g., rail travel) based on policy, schedule, estimated capacity and practical constraints.
3. Admin checks actual carrier availability, group-booking rules and costs using approved sources; AI must not fabricate train numbers or seats.
4. Admin records confirmed arrangement and communicates trip instructions to all travelers or their designated coordinator.

### Journey D: emergency travel

1. Any employee marks a request as **Emergency**, provides reason and desired departure.
2. The request appears prominently in Admin's urgent queue with immediate in-app notification.
3. Admin acknowledges, decides on suitable mode, records the decision, and sends details. Priority cannot bypass mandatory legal/safety controls.

## 6. Functional requirements

**Priority key:** P0 = MVP-critical; P1 = MVP desirable; P2 = later.

| ID | Priority | Requirement / acceptance intent |
|---|---|---|
| FR-01 | P0 | Login using company Microsoft identity or Admin-provisioned local account. No guest bookings. |
| FR-02 | P0 | Server-enforced role permissions; roles may be extended without changing every screen. |
| FR-03 | P0 | Request form: planned/emergency, requester, people count, purpose, origin, destination, date/time and return trip if applicable. |
| FR-04 | P0 | Capture expected site/department, required arrival, pickup flexibility and special assistance needs. |
| FR-05 | P0 | Show preferred mode **only** to managers/senior managers; Admin controls final allocation for everyone. |
| FR-06 | P0 | Save draft; submit; edit before approval; cancel with reason under configured policy. |
| FR-07 | P0 | Support individual request and Admin-created group roster / request-on-behalf. |
| FR-08 | P0 | Admin dashboard of unassigned requests with filters, emergency priority and due dates. |
| FR-09 | P0 | Rule-based compatible-route grouping with explicit explanation and manual reject/edit. |
| FR-10 | P0 | Create transport plans and assign one or multiple requests, without exceeding vehicle seat capacity. |
| FR-11 | P0 | Record mode (road/rail/air/sea), provider, vehicle/service identifier, departure/arrival, pickup/drop and booking reference. |
| FR-12 | P0 | Employee sees current stage, assigned plan, changes, coordinator contact and itinerary. |
| FR-13 | P0 | Create in-app notifications for submission, clarification, allocation, change and cancellation; email for eligible accounts. |
| FR-14 | P0 | Enforce explicit status transitions, reasons for reject/cancel and immutable audit records. |
| FR-15 | P0 | Admin creates, disables and resets local accounts; force credential change on initial sign-in. |
| FR-16 | P1 | Policy-configurable manager/HOD/Finance approval where travel type/threshold requires it. |
| FR-17 | P1 | Attach authorized documents, optional roster CSV, receipts or itinerary files, with access restrictions. |
| FR-18 | P1 | CSV export and simple by-location/date/category summary for Admin. |
| FR-19 | P2 | Real-time travel inventory, fare comparisons and booking APIs after provider approvals. |
| FR-20 | P2 | AI-assisted multi-stop optimization and natural-language explanation of tradeoffs. |

## 7. Request and allocation status models

**Request:** Draft -> Submitted -> Under Review -> Approved for Planning -> Allocated -> In Progress -> Completed. Alternate flows: Needs Clarification (returns to requester), Rejected (reason required), Cancelled (reason and actor required). Policy may allow Submitted -> Approved for Planning when Admin is the sole approver. No state is silently skipped in audit history.

**Transport plan:** Proposed -> Confirmed -> Dispatched/Booked -> In Progress -> Completed; alternate Cancelled. A group or plan has its own status so cancelling one worker does not necessarily cancel the others.

**Critical integrity rule:** Admin may not place two incompatible confirmed allocations for the same traveler/time window, or exceed the capacity of a booked vehicle. Manual exception requires an explicit authorized override and documented reason, if policy permits.

## 8. Screen inventory and UX priorities

| Screen | Primary action | UX notes |
|---|---|---|
| Sign in | Microsoft sign-in / Admin-provided credentials | Accessible dual entry, clear user help |
| Employee home | New travel request | Large single primary CTA; next trip card |
| Request wizard | Submit travel requirement | 3-4 short steps; auto-save; progress |
| Review & submit | Verify entered details | Human-readable summary, edit links |
| My travel | Track upcoming/past travel | Status and itinerary on one card |
| Admin overview | Triage requests | Priority queue, counts, filters |
| Grouping workspace | Combine compatible requests | List + optional route map, multi-select |
| Allocation detail | Choose vehicle/ticket plan | Capacity, schedule, cost and audit |
| Account & policy | Create users, manage roles | Restricted Admin-only surfaces |

## 9. Permission and approval expectations

| Action | Traveler | Manager | Travel Admin | HOD/Finance if configured | System Admin |
|---|---|---|---|---|---|
| Create own request | Yes | Yes | Yes | Yes | Yes |
| Preferred transport mode | No | Yes | Admin override | Policy-specific | Configuration only |
| View others' requests | No | Assigned direct reports only if enabled | Yes by scope | Assigned approvals only | By support policy |
| Group / assign transport | No | No | Yes | No | Emergency admin override only |
| Approve travel | No | Only if designated | By policy | Assigned request | Not automatically |
| Manage local users / roles | No | No | Limited provisioning if allowed | No | Yes |

Approvals are **policy-dependent and not yet confirmed in the meeting**. Launch should not assume HOD/Finance approval for every trip; the policy editor must permit a simple Admin-only MVP and additional gates later.

## 10. Acceptance-test scenarios

1. **Dual login:** Microsoft user and Admin-created local user can sign in and only see authorized records.
2. **Unauthorized action:** A worker cannot request a preferred mode using UI manipulation or direct API invocation.
3. **Request form:** All mandatory fields validate; draft can be resumed; submitting makes it visible to Admin.
4. **Emergency:** Urgent request is immediately distinguished and notified; Admin acknowledges it.
5. **Same-route suggestion:** Three eligible worker requests can be proposed for one vehicle with readable reasoning.
6. **False grouping prevention:** Two workers with incompatible arrival windows are not automatically grouped.
7. **Capacity:** Assigning 51 persons to a 50-seat vehicle is blocked or sent for documented correction.
8. **Bulk travel:** Admin can plan 50 named travelers with one itinerary and individual allocation records.
9. **Manager preference:** Manager can indicate a preferred mode, but Admin may choose a policy-compliant alternative with a note.
10. **Notifications:** Confirmed allocations and later changes appear in-app for local-account workers.
11. **Auditability:** Every decision retains actor, timestamp, prior/new status and reason where required.
12. **Resilience:** Lost connectivity does not fabricate a submitted request; clear retry/reconciliation messaging is shown.

## 11. Non-functional requirements and constraints

- **Light theme only.** Premium CRED-inspired tactile UI, with no default dark theme or dark pages. See UI Research & Design Direction document.
- Mobile-first for workforce; responsive desktop/tablet dashboard for Admin. Accessible controls with readable contrast.
- Reasonable usability on low-end Android devices and intermittent site networks; form auto-save and explicit sync state.
- English first, translation-ready strings; multilingual rollout requires business confirmation.
- Roles and approvals enforced on the server; least privilege, rate limiting and request logs.
- No unconsented live location tracking. Origin/pickup points are user-entered or explicitly selected.
- Secure document/PII handling, retention policy, export permissions, and company-approved hosting.
- No automatic AI ticket purchases in MVP; every booking is human-confirmed and sourced from authorized providers.

## 12. Company ownership and delivery guardrails

**Required from day one:** code in a company-owned GitHub organization/repository; Convex application within a company-owned team/project with production and development environments; company-owned authentication, hosting, domain, map/API billing, keys, asset library and deployment access. Personal accounts (including existing personal GitHub/Convex projects) are not to own or host the new app. Use company-approved Claude environment for coding and ChatGPT image generation for original decorative assets. No secret, personal data, customer identity or source-code dump in image prompts.

## 13. Delivery phases

| Phase | Deliverables | Gate |
|---|---|---|
| 0. Company setup | Accounts, private repo, policies, environments | Company admin verifies ownership |
| 1. App skeleton + identity | Design system, login, role middleware, account provisioning | Security smoke test |
| 2. Travel requests | Mobile wizard, status, Admin inbox | Journey A/B basic UAT |
| 3. Planning | Grouping, capacity constraints, allocation, notifications | Journey A/C and negative tests |
| 4. Hardening and pilot | Audits, accessibility, backup, performance, training | Admin + worker pilot sign-off |
| 5. Advanced integrations | Licensed travel inventory, finance/ERP, optimization | Separate scope and budget approval |

## 14. Open decisions requiring stakeholder confirmation

| Topic | Proposed default; confirmation needed |
|---|---|
| App name/domain | Working name ProRack Move; official brand owner to approve |
| Organization structure | Which ProRack companies/sites are in MVP? |
| Approvals | Admin-only first, or HOD/Finance gates by amount/purpose? |
| Shift routing windows | Allowed pickup flexibility, maximum detour, safe pickup locations? |
| User onboarding | Source of worker IDs, admin-created email identifiers, deactivation process? |
| Vehicle inventory | Owned vs hired vehicles, seat rules, driver assignment, costs? |
| Notifications | In-app required; email/SMS/WhatsApp recipients and consent? |
| Booking | Manual authorized channels in MVP; exact commercial providers later? |
| Data policy | Retention period, export rights, storage region, incident procedures? |
| Multi-language | Which languages and priority? |

## 15. Source and research references

- [R1] CRED NeoPOP Web (official GitHub): https://github.com/CRED-CLUB/neopop-web
- [R2] Navan for Travel Managers: https://navan.com/solutions/travel-managers
- [R3] Perk travel approvals: https://support.perk.com/hc/en-us/articles/21925996266524-Travel-approval-processes-in-Perk
- [R4] Uber for Business India: https://www.uber.com/in/en/business/
- [R5] WCAG 2.2: https://www.w3.org/TR/WCAG22/

**Document classification:** Internal product planning. Confirm open decisions before external release or production deployment.
