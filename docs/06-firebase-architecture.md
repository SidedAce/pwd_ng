# PWD Firebase Architecture

## Goal

Use Firebase as the full backend platform for authentication, persistence, scheduled processing, authority enforcement, and deployment.

## Firebase Services In Scope

- Firebase Auth
- Firestore
- Cloud Functions
- Firebase Hosting
- Firebase Security Rules

No separate backend server should be introduced for the MVP.

## Responsibility Map

### Firebase Auth

Use Auth for:

- sign-in
- account identity
- session bootstrap identity
- global role claims where appropriate

Auth should answer who the user is. Firestore should answer what the user can do in a given campaign context.

## Firestore

Use Firestore for:

- authoritative campaign state
- player-submitted actions
- GM adjudications
- logs and world events
- runtime configs

Firestore is the source of truth for the game world.

## Cloud Functions

Use Cloud Functions for:

- action validation
- action processing
- scheduled economy tick
- production completion processing
- report generation helpers if needed
- audit log emission

Cloud Functions should hold backend authority logic that must not depend on the client.

## Hosting

Use Firebase Hosting for:

- serving the Vite-built React app
- routing SPA navigation correctly
- deploying a single web surface for players and GMs

## Security Rules

Use Firestore Rules to:

- prevent direct writes to authoritative collections by players
- limit reads based on identity, membership, and role
- protect hidden information

Rules are the guardrail, not the place for complex business workflow.

## Recommended Environment Separation

Use at least:

- local emulator environment
- development Firebase project
- production Firebase project

Git branches and deployment targets should stay aligned to prevent accidental production changes.

## Client To Backend Flow

### Deterministic Action Flow

1. Player signs in through Firebase Auth.
2. Client reads allowed state from Firestore.
3. Player submits an `actions` document.
4. Cloud Function validates and processes it.
5. Firestore authoritative documents update.
6. UI re-renders from updated state.

### GM Review Flow

1. GM reviews pending actions in the app.
2. GM approves, rejects, or adjudicates through controlled forms.
3. Cloud Function or secure write updates state and logs.
4. Event and audit records are emitted.

## Data Access Pattern Guidance

- prefer feature-level reads rather than loading the whole campaign
- store reference ids instead of deep nested documents
- avoid denormalization unless it improves critical reads and can be safely maintained
- keep player-readable and GM-only data clearly separated

## Offline And Sync Expectations

Offline support is not a primary MVP goal. We can benefit from Firestore caching behavior, but we should not design workflows that depend on offline mutation correctness.

## Cloud Function Design Guidance

- each function should own a narrow responsibility
- validation and mutation should be predictable and auditable
- scheduled functions should be idempotent
- functions should write audit records when changing authoritative state

## Deployment Guidance

The deployment flow should remain simple:

1. develop in Git branch
2. validate locally or in emulator
3. deploy hosting, rules, and functions through Firebase tooling
4. verify environment behavior

## Things We Should Not Add Right Now

- separate Node API server
- extra database layer
- GraphQL layer
- complex orchestration tooling
- extra hosting platform
