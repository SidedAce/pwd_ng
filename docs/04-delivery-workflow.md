# PWD Delivery Workflow

## Why This Exists

This project should not drift into ad hoc feature work. The delivery process needs to preserve the planning-first approach you want.

## Working Rule

No feature is considered ready for implementation until it has:

- a documented goal
- defined inputs and outputs
- authority boundaries
- schema impact
- validation rules
- UI surfaces
- acceptance criteria

## Documentation Hierarchy

### Level 1: Core Project Documents

These are the permanent baseline docs in this repository.

- product and scope
- system architecture
- phased roadmap
- delivery workflow

### Level 2: Feature Specs

Each major subsystem should receive its own feature spec before implementation.

Suggested upcoming specs:

- authentication and roles
- nation lifecycle
- province and structure management
- action framework
- economy tick
- production system
- asset registry
- formations
- GM queue and adjudication
- reporting engine

### Level 3: Build Tasks

Once a feature spec is approved, it can be broken into implementation tasks.

Each task should include:

- objective
- files or systems affected
- dependencies
- definition of done

## Feature Spec Template

Use the following structure for future subsystem documents:

1. Purpose
2. User roles involved
3. Inputs
4. Outputs
5. State affected
6. Firestore collections touched
7. Validation rules
8. Permission rules
9. Failure states
10. UI surfaces
11. Backend jobs or functions
12. Audit and reporting impact
13. Acceptance criteria
14. Open questions

## Change Control

Any change to the following requires doc updates before or alongside implementation:

- collection structure
- core action types
- permissions and visibility
- economy formulas
- report semantics
- GM authority boundaries

## Phase Gating

A phase should only begin when:

- the previous phase exit criteria are met or intentionally waived
- the affected feature specs exist
- dependencies are explicit
- success criteria are testable

## Implementation Expectations

When implementation begins, every substantial system should be built in this order:

1. write or confirm the feature spec
2. define data contracts
3. define backend authority and validation
4. build UI around those contracts
5. verify with tests or structured validation
6. update docs if the implementation refined the spec

## Documentation Debt Rule

If code and docs diverge, the divergence must be resolved immediately. The project should never rely on undocumented institutional memory for critical rules.

## Recommended Planning Backlog

The next documentation passes should likely be:

1. page and route architecture
2. field-level Firestore schema
3. action catalog
4. security rules matrix
5. Cloud Functions map
6. GM tool workflows
7. reporting definitions
