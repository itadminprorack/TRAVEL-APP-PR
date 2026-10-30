# ProRack Move | Stakeholder Walkthrough

**Audience:** Prajakta ma'am, Sam and ProRack Administration / Technology leadership

## One-sentence pitch

Employees explain where and when they need to travel; ProRack's Admin team sees all demand together and can coordinate the right transport instead of handling disconnected calls and messages.

## Demonstration agenda (8–10 minutes)

**Fastest option:** Start the app, select any demo persona, and click **Guided tour** in the header. The seven steps automatically navigate through worker, manager, Admin, route planning, transport plans and reports. The guide can be closed at any time.


| Minute | Present | Talking point |
|---|---|---|
| 0-1 | Local login role chooser | Different worker, engineer, manager and Admin experiences; real authentication will be connected later. |
| 1-2 | Worker home | One large Plan Travel action; upcoming journey and status. |
| 2-3 | Four-step request wizard | Purpose, urgency, destination/date, traveler count, review, submit. |
| 3-4 | Manager view | Managers may suggest transport mode; other employees cannot. Admin still decides. |
| 4-5 | Admin request queue | Needs attention, emergency indicator, approval and clarification controls. |
| 5-6 | Route planning | Kothur/Shamshabad/Kondapur travel demand surfaces as potential shared pickup; human verifies route. |
| 6-7 | Transport allocation | Enter vehicle capacity, pickup and provider. Demo rejects allocations that exceed capacity. |
| 7-8 | Transport plan updates | Open an existing plan; update pickup or vehicle details, verify the audit notification. |
| 8-9 | Travel itinerary | Preview and optionally print a sample itinerary marked DEMO / NOT A TICKET. |
| 9-10 | Bhiwandi / reports | 50-person group, rail recommendation without live booking, CSV report and future integrations. |

## Decisions to collect

1. Who is the initial Travel Admin, and who may approve or reject requests?
2. Which departments can create 50-person group requests and maintain verified rosters?
3. How far in advance should regular travel be requested? What is the emergency SLA?
4. What are actual vehicle types/capacities, pickup locations, safety rules and shift windows?
5. Are HOD/Finance approvals needed for certain trip types or values?
6. What is the expected internal identity provisioning and Microsoft Entra setup?
7. Which approved cloud/booking/map providers can be used after MVP approval?

## Safety note

The demo uses browser storage and synthetic data. It does not authenticate real users, determine road feasibility, check tickets or make reservations. No real travel or employee PII should be entered.
