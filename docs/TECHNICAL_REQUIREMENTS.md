# ProRack Move | Technical Requirements Document (TRD)

**Working title:** ProRack Move (subject to naming approval)  
**Version:** 1.0 | **Prepared:** 29 October 2026  
**Document owner:** ProRack Technology  
**Implementation assistance:** Claude Opus 5.5 for authorized code development; ChatGPT image generation for original visual assets  
**Status:** Recommended architecture pending technical and licensing sign-off

## 1. Architecture decision summary

Build a **company-owned, mobile-first React web application / installable PWA** with a separate responsive Admin workspace and a real-time backend. Use deterministic operational rules before adding generative AI. All transport purchases and bookings require Admin confirmation.

| Layer | Preferred MVP choice | Rationale / caveat |
|---|---|---|
| Frontend | React + TypeScript + Vite | Fast client-side application; works cleanly with Convex |
| Mobile delivery | Responsive PWA, installable | Launch quickly without app stores; offline-aware but not promised fully offline |
| UI primitives | Tailwind CSS, shadcn/ui + Radix | Accessible primitives, original light-theme design system |
| Animation | Motion / CSS transitions | Original tactile NeoPOP-inspired interactions; reduced-motion control |
| Forms | React Hook Form + Zod | Strong validation and type-safe form workflow |
| State & data | Convex (company-owned team/project) | Realtime queries, mutations, actions, file storage |
| Authentication (preferred) | Clerk + Convex integration | Microsoft Entra sign-in plus admin-provisioned credential users; **company-owned Clerk tenant required** |
| Authentication (alternate) | Convex Auth with proven identity adapter | Fewer vendors but Convex Auth remains beta; Microsoft integration must be proven before selection |
| Maps/routing | Google Routes API *optional* | Route matrix / ETAs for grouping; billed usage and data-policy approval needed |
| AI recommendation | Company-approved AI API behind server action | Explain group/mode suggestions; no automatic ticket purchase |
| Hosting | Company-controlled Vercel or Cloudflare Pages | Choose after IT approval; use company domain and access |
| Monitoring | Error and activity events; optional hosted service | No personal deployment or logging account |

**Rationale:** Convex officially supports team-scoped projects and integrates with Clerk; Clerk offers Microsoft Entra connections and an account creation API. Enterprise SAML can require a paid plan. Authentication licensing and actual production capabilities must be verified against company policy before coding. [T1-T4]

## 2. High-level system structure

```text
Mobile / desktop browser (React PWA)
    | Clerk sign-in / Microsoft Entra / local credential
    v
Convex client (authenticated queries + mutations)
    |
    +-- Users, roles, travel requests, groups, allocations
    +-- Approvals, audit records, status transitions
    +-- Notifications, basic exports, document metadata
    |
    +-- Server-only actions / adapters
         |-- Geocoding and route matrix (approved map service)
         |-- AI suggestion / explanation (approved provider)
         |-- Email/push integrations (approved provider)
         +-- Future ERP / booking provider APIs

GitHub company repository -> reviewed pull request -> CI -> company preview/UAT
                                          -> approved production release
```

The AI coding workspace may edit a **company-owned development repository** using authorized access. It must not silently deploy to production or own private source code in a personal fork.

## 3. Identity, access and onboarding design

### 3.1 Identity paths

1. **Microsoft staff:** Authenticate with the company's Microsoft Entra ID tenant through a configured and approved SSO connection; validate tenant/company policy, then link stable provider subject to internal `userId`.
2. **Workers without Microsoft accounts:** Authorized Admin creates an application identity via the company-owned authentication provider. The worker receives a unique identifier and secure temporary activation process. Force password reset on first use; do not send or retain plaintext permanent passwords.
3. **Account lifecycle:** New -> invited/activated -> active -> suspended/deactivated. Revoking an account must invalidate future data access and block new sessions under provider capabilities.
4. **Multiple credentials:** A person must not accidentally gain a second account with different roles. Any identity linking requires a verified admin workflow.

Clerk and similar providers can support password and enterprise sign-in, but **the exact Microsoft Entra connection type, MFA, deprovisioning, cost and user-creation mechanism are prerequisites**, not assumed complete. Clerk SAML may require a paid plan. [T2-T4]

### 3.2 Authorization model

User roles are stored by the app backend and cannot be trusted solely from the client or email domain. All reads and writes check: `authenticated actor -> active company membership -> role -> org/site/department scope -> record ownership -> action permission`.

| Role | Allowed scope |
|---|---|
| Worker / Employee | Own requests, own notifications, own itineraries |
| Manager / Senior manager | Own requests plus mode preference; reports only if explicitly enabled |
| Travel Admin | Requests/plans/allocations within assigned company and sites |
| Assigned approver | Read and decide requests specifically assigned by approval policy |
| System Admin | Create users, policies and org settings; critical actions audited |

Never expose other workers' names, locations or travel details to unrelated users. Location is not continuously tracked in this product.

## 4. Company ownership and environment bootstrap

**Hard requirement: begin in official company-owned accounts.**

| Resource | Provisioning rule |
|---|---|
| GitHub | Private repo under company organization; no personal `DevTH97`-owned repo/fork |
| Convex | Create project inside company's Convex team; named Admin and Developer roles |
| Auth provider | Company-controlled billing, credentials and admin recovery |
| Hosting/domain | Company-owned project, DNS, SSL and owner recovery |
| Maps/AI/email | Company billing accounts; server-side scoped API keys, usage quotas |
| Assets | Shared company-controlled source asset folder with approvals |
| CI/CD | Org GitHub secrets/OIDC; protected main; environment-specific approvals |
| Environments | Separate `dev`, `uat/staging`, and `prod` deployments and variables |

At least two designated company administrators should have recovery access. Restrict repository merge and production deployment rights; use code reviews and a production approval gate. Company-owned accounts are preferable to shared personal login sessions. GitHub provides organizational roles and branch protections; Convex provides team roles. [T1, T5, T6]

## 5. Data model (Convex collections)

All data records include `organizationId` (or equivalent tenant), `createdAt`, `updatedAt`, and soft-deletion/retention metadata where appropriate. Record identifiers should be generated and immutable. Documents and PII must be stored only in authorized collections.

| Collection | Key fields / relationships |
|---|---|
| `organizations` | name, timeZone, policyConfig, active |
| `sites` | organizationId, name, address, placeId, city, active |
| `departments` | organizationId, name, code, headUserId? |
| `users` | authProviderSubject, displayName, role, category, siteIds, deptId, accountStatus, lastActiveAt |
| `travelRequests` | requestedBy, beneficiaryIds, groupRequestId?, type, urgency, purpose, origin, destination, desiredDepartAt, arriveBy?, returnAt?, passengers, constraints, status, version |
| `travelPassengers` | requestId, personUserId? or controlled roster recordId, specialAssistanceFlag (restricted), assignmentId? |
| `approvalDecisions` | requestId, stage, approverId, decision, reason, decidedAt, policyVersion |
| `transportPlans` | destination, originArea?, departAt, arriveAt?, mode, status, capacity, vehicleId?, coordinatorId, version |
| `planStops` | planId, order, name, placeId?, scheduledAt, type=pickup/dropoff |
| `planAssignments` | planId, requestId, travelerIds, allocatedSeats, boardingStopId?, bookingId?, status |
| `vehicles` | type, registration?, provider, permittedCapacity, availability, active |
| `bookings` | planId, provider, serviceRef, mode, purchaseStatus, bookedBy, cost?, currency?, ticketAttachmentIds, confirmationAt |
| `suggestions` | inputRequestIds, candidatePlan, scoreComponents, explanation, sourceVersion, providerTimestamp?, expiresAt, reviewedBy? |
| `notifications` | recipientUserId, event, channel, deliveryState, deliveredAt?, readAt?, dedupeKey |
| `attachments` | storageId, visibilityScope, mime, size, linkedRecordId, uploadedBy |
| `auditEvents` | actorUserId, eventType, entityType, entityId, priorStatus?, nextStatus?, changeSummary, createdAt |
| `policies` | category, roles, approvalRouting, timeWindows, capacityRules, maxDetour, effectiveAt |

### 5.1 Fields and data invariants

- Record an **exact** requested arrival time and timezone; don't silently change dates when crossing midnight.
- Normalize origin/destination from user-entered text to optional map/place IDs; preserve raw text and confidence.
- A request can represent **one or multiple passengers**; roster entries must be traceable individually.
- Do not permit overlapping confirmed assignments for the same person and time interval.
- Plan occupied seats must be less than or equal to effective vehicle capacity.
- A preferred mode is accepted only if server-resolved role is Manager or Senior Manager.
- Any AI output is a proposal with provenance, never authoritative seat or ticket availability.

## 6. Key Convex function contracts

Use Convex's query/mutation/action model; validate inputs with Convex validators and Zod at UI boundaries. These names are **proposed interfaces**, not existing endpoints.

| Function | Type | Main behavior |
|---|---|---|
| `users.me` | Query | Return self with authorized role and UI capabilities |
| `users.provisionWorker` | Action/mutation | Admin-only identity provider create + app profile; audit |
| `travelRequests.createDraft` | Mutation | Create own draft from validated payload |
| `travelRequests.submit` | Mutation | Atomically transition draft -> submitted; notify Admin |
| `travelRequests.listMine` | Query | Ownership-filtered request list |
| `travelRequests.listAdminQueue` | Query | Scope-filtered requests with pagination and filters |
| `travelRequests.requestClarification` | Mutation | Admin returns request with required reason |
| `travelRequests.decide` | Mutation | Authorized approval/rejection per policy |
| `grouping.propose` | Action | Compute deterministic candidates and optional routes |
| `transportPlans.create` | Mutation | Authorized plan draft, passenger candidates |
| `transportPlans.confirm` | Mutation | Atomic seat and overlap validation, audit, notify |
| `transportPlans.recordBooking` | Mutation | Store verified external booking metadata |
| `transportPlans.updateStatus` | Mutation | Enforce allowed transitions and event record |
| `notifications.listMine` | Query | Read signed-in user's messages |
| `admin.getMetrics` | Query | Authorized aggregated counts, travel cost by status |

All mutating functions reject missing identity, cross-company records, wrong role, invalid state, stale version, invalid route group, and duplicate idempotency key.

## 7. State transitions and approval policy

```text
REQUEST
Draft -> Submitted -> UnderReview -> ApprovedForPlanning -> Allocated
                        |                     |                 |
                        v                     v                 v
                 NeedsClarification      Rejected           InProgress -> Completed
                        |
                 Resubmitted -> UnderReview

Cancel permitted only under policy; create audit event and notify impacted parties.

PLAN
Proposed -> Confirmed -> DispatchedOrBooked -> InProgress -> Completed
               |                                  |
               +---------- Cancelled -------------+
```

**Implementation note:** Request statuses and plan statuses are separate. `ApprovedForPlanning` may be immediate if Admin alone handles intake; optional HOD/Finance controls are configured per policy. Rejection and clarification are not interchangeable.

Approval decision records must retain policy version and assignee. Admin cannot bypass configured mandatory approvers without explicitly authorized, audited exception.

## 8. Grouping and recommendation engine

### 8.1 Phase 1: transparent deterministic grouping

A candidate group is generated only if: (a) same organization/authorized pool; (b) compatible travel date and arrival window; (c) compatible destination area; (d) feasible pickup route and detour; (e) total passenger count fits a chosen vehicle; (f) safety/accessibility constraints permit travel together; (g) no confirmed conflicting allocation.

A suggested plan should display **why** requests were grouped (same site, overlapping arrival time, estimated pickup detour), not merely a black-box score.

```text
for each unallocated request:
  normalize place, departure window, required arrival, count
cluster by company + date + destination vicinity + compatible windows
for each cluster:
  exclude conflicts, preserve assistance constraints
  enumerate vehicle capacity candidates and pickup order
  optionally call approved route matrix for ETA/distance
  score = time_fit + route_compatibility + seat_utilization - detour_penalty
  emit suggestion with constraints, assumptions, confidence and reasons
Admin can edit, split, decline or confirm. A confirmation is transactional.
```

### 8.2 Phase 2: optional AI assistance

AI may summarize alternatives (van vs bus vs train), explain trade-offs and propose a route plan. Inputs should be **data-minimized**, e.g. area-level coordinates, traveler counts and times rather than worker names or personal contact information. AI recommendations must undergo schema validation, policy guardrails, cost checks and human acceptance. Do not fabricate schedules, seat inventory, prices or booking confirmations.

Google Routes API can provide route calculations and matrices, with pricing and quotas; use only when a company account and usage budgets are approved. Maps data can be unavailable or incomplete in some areas; always support manual route selection. [T7, T8]

## 9. Notifications and documents

- **MVP channels:** in-app notifications for everyone; email for verified eligible recipients where company email provider is configured.
- **Triggers:** submitted, clarification requested, approved/rejected, assigned, changed, confirmed/booked, cancelled, upcoming trip reminder (if enabled).
- **Reliability:** use a notification event/outbox record and idempotent delivery attempts; success is reported only after provider acknowledgement, not when queued.
- **Workers:** local-account users must not rely on an Outlook inbox to receive updates. Clear in-app status remains the source of truth.
- **Later channels:** SMS or WhatsApp Business via authorized opt-in and compliant provider; not included automatically.
- **Files:** ticket PDFs, group roster and attachments stored via controlled file storage, signed access and MIME/size validation. Never expose public URLs for private travel documents.

## 10. Security, privacy and operations

| Risk | Technical requirement |
|---|---|
| Account compromise | MFA where supported, password reset, revoke sessions, rate limits, login anomaly logging |
| Privilege escalation | Server-side RBAC, least-privilege role assignment, audit admin role changes |
| PII exposure | Tenant/site ownership checks on every query/action, field-level minimization |
| Sensitive travel data in AI | Aggregate or pseudonymize before calling AI; company-approved provider only |
| Duplicate request | Idempotent submit and booking confirmation, optimistic concurrency/version |
| Map/API key exposure | Server-only keys for paid APIs, domain restrictions for map client SDK |
| Overbooked vehicle | Transactional seat counting, concurrency tests, no negative capacity |
| Audit deletion | Append-only audit events, restricted retention/archive policy |
| Unauthorized production deployment | PR review, CI, staging UAT, separate production approval |
| Service outage | Retryable writes, clear offline messaging, backups and tested restore |

**Privacy default:** do not collect continuous device GPS, passport numbers, payment card data, or bank details unless a separate approved feature requires them. Retention, data locality, privacy notice and logs should be approved by company leadership/IT.

## 11. UX and performance implementation requirements

- **Light-only theme:** near-white canvas, white cards, deep navy text, ProRack blue as primary, orange as accent; no dark screen backgrounds.
- Original, CRED-inspired tactile components (elevated CTA, controlled shadows, responsive pressed state) without copying CRED branded UI or licensed artwork.
- Responsive breakpoints: mobile-first up to 767px; tablet 768-1199px; desktop >= 1200px (proposed).
- Standard touch targets aim for 44-48px in user-critical flows; meet WCAG 2.2 AA as applicable, including 4.5:1 normal text contrast and >=24x24 CSS px or adequate spacing targets. [T9]
- Form progress saved as draft; system must distinguish stored draft, queued operation, and successfully submitted request.
- Motion: 120-240ms feedback, optional longer page transition under 350ms; respect `prefers-reduced-motion` and never rely on animation for state. [T10]
- Device/network tests: budget Android phones, mobile Chrome, iOS Safari, weak 3G/4G, tablets and laptop browsers.
- Performance budgets (targets, not guaranteed): fast meaningful first render; Web Vitals reviewed in field; keep initial bundle lean and images responsive.

## 12. Development and release architecture

1. **Company creates project:** company GitHub org private repo, company Convex team project, company auth tenant, company hosting. Log ownership and recovery contacts before any code generation.
2. **Source layout:** `/src/app` routes and providers; `/src/components` UI primitives; `/src/features/travel` request flows; `/src/features/admin` dashboard; `/src/lib` validation; `/convex` schema/functions; `/tests` unit/e2e.
3. **Branching:** feature branches -> pull requests -> automated typecheck/lint/unit tests -> human review -> `main` or release branch. Staging preview on approved PR; production gated.
4. **Environments:** independent Convex dev/UAT/prod project configurations; never share production admin API keys with Claude, GitHub agents or preview environments.
5. **Deploy:** code merges do not silently migrate production data or run privileged scripts; explicit change review, migration plan and rollback.
6. **Observability:** errors, slow requests, denied authorization and grouped request outcomes; logs avoid sensitive payloads.

### 12.1 Suggested repository structure

```text
prorack-move/
  docs/PRD.md, TRD.md, DESIGN_RESEARCH.md, ADRs/
  src/app/, src/components/ui/, src/features/
  src/lib/auth/, src/lib/validation/, src/styles/
  convex/schema.ts, convex/users.ts, convex/travelRequests.ts
  convex/transportPlans.ts, convex/grouping.ts, convex/notifications.ts
  tests/unit/, tests/integration/, tests/e2e/
  public/assets/  (approved original assets only)
  .github/workflows/
```

## 13. Quality, UAT and release gates

| Quality level | Required cases |
|---|---|
| Unit | Form validation; role preference; time overlap; group scoring; capacity math |
| Integration | Auth mapping; submit->Admin queue; confirmed allocation; notification outbox |
| Authorization | Worker cannot see other worker requests; manager cannot allocate; Admin scoped to site |
| Concurrency | Simultaneous seat allocations cannot exceed capacity; duplicate request clicks are idempotent |
| Negative flows | Missing geocode, bad map response, rejected travel, no vehicle, failed booking entry |
| Accessibility | Keyboard navigation, screen reader labeling, contrast, reduced motion, error focus |
| Operations | Restore staging backup, change branch, release rollback, revoked local account |
| Pilot | Kothur/Shamshabad/Kondapur sharing scenario; Mumbai visit; 50-person Bhiwandi scenario |

**MVP release criterion:** all P0 acceptance scenarios from PRD pass with screenshots/evidence, and Admin/HR confirm permissions and emergency procedure. Production connection to any ERP or provider requires separately approved credentials and UAT.

## 14. Critical architecture decisions / ADRs to sign off

| ADR | Proposed choice | Decision owner |
|---|---|---|
| ADR-001 | React Vite PWA rather than native mobile app for MVP | Tech lead + Admin |
| ADR-002 | Convex in company team, separate environments | IT / Tech lead |
| ADR-003 | Clerk dual login vs alternative approved auth platform | IT security / Tech lead |
| ADR-004 | No autonomous bookings or purchases in MVP | Admin / Finance |
| ADR-005 | Route algorithm deterministic first; AI explanation optional | Tech lead |
| ADR-006 | Company Google Maps account subject to cost policy | IT / Finance |
| ADR-007 | Data location, retention and employee privacy policy | IT / HR / Legal |
| ADR-008 | HOD/Finance approval matrix by role and cost | Business owner |

## 15. Claude Opus 5.5 delivery workflow

Use **small, reviewable implementation phases**, not a one-shot whole-app rewrite.

**Phase A:** Read all three docs, identify unresolved ADRs, write implementation plan and screen/data contract. Do not initialize personal accounts.

**Phase B:** Build original light design-system primitives, authentication shell, login capability gating and component tests using synthetic users.

**Phase C:** Implement Convex schema, server-side authorization, request flow and Admin inbox with unit/integration tests.

**Phase D:** Implement trip groups, vehicle capacity, allocation transactions, notification outbox and audit.

**Phase E:** Implement optional AI suggestion adapter, deterministic fallback, UX polish, accessibility and staging UAT.

**Phase F:** Produce deployment guide, runbooks, threat model, backup/rollback checklist and stakeholder sign-off report.

When using AI coding tools: require a plan, changed-files summary, tests run, security review, and explicit human approval before production. Never paste real credentials or private-key contents into prompts.

## 16. Official source references

- [T1] Convex teams and roles: https://docs.convex.dev/dashboard/teams/teams
- [T2] Convex and Clerk integration: https://docs.convex.dev/auth/clerk
- [T3] Clerk Microsoft Entra connection: https://clerk.com/docs/guides/configure/auth-strategies/social-connections/microsoft
- [T4] Clerk SAML Entra requirement: https://clerk.com/docs/guides/configure/auth-strategies/enterprise-connections/saml/azure
- [T5] GitHub organization roles: https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles
- [T6] GitHub protected branches: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches
- [T7] Google Routes API: https://developers.google.com/maps/documentation/routes/
- [T8] Google Routes billing: https://developers.google.com/maps/documentation/routes/usage-and-billing
- [T9] WCAG 2.2: https://www.w3.org/TR/WCAG22/
- [T10] Apple motion HIG: https://developer.apple.com/design/human-interface-guidelines/motion
- [T11] Convex Auth beta status: https://docs.convex.dev/auth/convex-auth
- [T12] Clerk create user API: https://clerk.com/docs/reference/backend/user/create-user

**Document classification:** Internal technical planning. API versions, vendor plan eligibility and all third-party costs require verification during implementation.
