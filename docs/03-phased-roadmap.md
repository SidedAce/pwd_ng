# PWD Phased Roadmap

## Planning Strategy

Each phase should end in a coherent checkpoint with working software, updated documentation, and a short validation pass.

We should avoid starting too many systems at once. The correct order is to establish authority, then state, then workflows, then reporting depth.

## Phase 0: Planning And Specification

Goal: finalize how the game and platform will work before app scaffolding begins.

Deliverables:

- game design baseline
- architecture and authority model
- Firestore collection responsibilities
- phased roadmap
- delivery workflow

Exit criteria:

- core entities are named
- action pipeline is agreed on
- roles and permissions are clear
- build order is approved

## Phase 1: Platform Foundation

Goal: create the minimum application skeleton and authenticated access model.

Scope:

- Firebase project setup
- authentication
- base app routing
- session model
- user profile and role bootstrap
- nation application and approval workflow

Deliverables:

- working login flow
- session-aware shell
- player and GM route guards
- nation creation request flow
- initial Firestore rules draft

Exit criteria:

- users can sign in
- GMs can approve nation participation
- players can reach a nation dashboard shell

## Phase 2: World State Foundation

Goal: establish authoritative map-adjacent state and nation management views.

Scope:

- nation dashboard read model
- provinces collection and ownership
- structures collection and placement model
- nation treasury and derived summary fields

Deliverables:

- read-only nation dashboard
- province management UI
- structure viewing and placement forms
- backend validation for structure placement

Exit criteria:

- a nation can own provinces
- a province can host structures
- the dashboard reflects authoritative stored state

## Phase 3: Action Pipeline

Goal: make actions the default interface for player intent.

Scope:

- action document schema
- action submission UI
- validation functions
- auto-approval rules for deterministic actions
- audit log generation

Deliverables:

- reusable action submission framework
- action history view
- validation and error states
- audit log records for accepted actions

Exit criteria:

- players can submit valid actions
- deterministic actions process without GM intervention
- invalid actions fail safely and visibly

## Phase 4: Economy And Production

Goal: support the economic loop and timed asset creation.

Scope:

- economy tick
- income calculation
- sanctions and modifiers framework
- production orders
- order completion logic
- cancellation rules

Deliverables:

- scheduled daily economy processing
- production order UI
- timers and completion handling
- treasury updates tied to valid actions

Exit criteria:

- income is applied automatically
- production orders complete into assets
- cancellations respect refund rules

## Phase 5: Assets And Formations

Goal: support operational organization and deployment constraints.

Scope:

- asset registry
- asset design definitions
- formation creation and editing
- assignment and reassignment
- location tracking

Deliverables:

- asset inventory views
- formation management UI
- backend validation for assignment rules

Exit criteria:

- assets exist independently of formations
- formations can organize assets
- unassigned deployment restrictions are enforceable

## Phase 6: GM Operations

Goal: make the GM workflow viable entirely inside the application.

Scope:

- GM action queue
- adjudication tools
- world edit panel
- event injection
- visibility controls

Deliverables:

- GM review dashboard
- action resolution forms
- world event creation flow
- targeted override tools

Exit criteria:

- GMs can resolve contested actions in the UI
- GMs can edit world state without raw DB work
- visibility control exists for intelligence-sensitive data

## Phase 7: Reporting

Goal: replace manual comparison and status tracking with generated outputs.

Scope:

- economy comparison report
- infrastructure comparison report
- military totals report
- formation breakdown report

Deliverables:

- on-demand report generation
- exportable or shareable report views
- role-aware visibility filtering

Exit criteria:

- GMs can generate core comparison sheets from stored data
- reports are consistent with authoritative state

## Phase 8: Campaign Hardening

Goal: prepare the platform for live operational use.

Scope:

- test coverage for critical workflows
- data backfill scripts if needed
- admin ergonomics improvements
- bug fixing and rule tuning

Deliverables:

- regression checklist
- operational runbook
- launch readiness review

Exit criteria:

- critical flows are tested
- documentation matches reality
- a live session can be run without spreadsheet fallback

## Recommended Immediate Next Planning Steps

Before writing code, we should next produce:

1. route and page map for player and GM experiences
2. Firestore document field-level schema definitions
3. action type catalog with payload contracts
4. security rules outline
5. Cloud Functions responsibility map
