# PWD App Structure

## Stack Constraint

The application should be built with:

- Vite
- React
- Firebase
- Git

No additional framework should be introduced unless the project hits a proven limitation that cannot be solved cleanly within this stack.

## Frontend Philosophy

The React application should stay simple and legible:

- route-driven page architecture
- reusable feature-oriented components
- Firebase-backed data flows
- minimal client-side business authority

The client is responsible for presenting state and collecting player or GM intent. It is not responsible for final authority over world state.

## Top-Level Route Map

### Public

- `/`
- `/login`
- `/request-access`

### Shared Authenticated

- `/app`
- `/app/profile`
- `/app/session-select`
- `/app/events`
- `/app/actions`

### Player

- `/app/nation`
- `/app/nation/overview`
- `/app/nation/provinces`
- `/app/nation/structures`
- `/app/nation/production`
- `/app/nation/assets`
- `/app/nation/formations`
- `/app/nation/diplomacy`
- `/app/nation/actions/new`

### GM

- `/app/gm`
- `/app/gm/sessions`
- `/app/gm/nations`
- `/app/gm/actions`
- `/app/gm/adjudications`
- `/app/gm/world`
- `/app/gm/events`
- `/app/gm/reports`
- `/app/gm/config`

## Route Intent

### `/`

Landing page with game intro and login entry point.

### `/login`

Firebase Auth entry flow.

### `/request-access`

Initial player request and campaign join workflow.

### `/app`

Authenticated shell route that redirects based on role and session status.

### `/app/profile`

User profile, display name, and account-level metadata.

### `/app/session-select`

Pick the active campaign session when the user participates in multiple sessions.

### `/app/events`

Role-filtered event feed.

### `/app/actions`

Actor-visible action history and statuses.

### `/app/nation/*`

Player nation management surfaces.

### `/app/gm/*`

GM operational and administrative surfaces.

## Layout Structure

### PublicLayout

Used for unauthenticated pages.

### AppLayout

Shared authenticated shell with:

- top navigation
- session context switcher
- role-aware side navigation
- account menu

### NationLayout

Nested player navigation for nation management.

### GmLayout

Nested GM navigation for moderation and world control.

## Page Ownership

### Player Pages

Primary concerns:

- understanding current nation state
- submitting actions
- organizing formations and production
- reading approved world information

### GM Pages

Primary concerns:

- reviewing pending actions
- adjudicating contested actions
- editing world state through controlled forms
- generating reports
- managing visibility and exceptional rulings

## Component Strategy

Use feature-oriented folders rather than purely technical folders.

Suggested major feature groups:

- `auth`
- `sessions`
- `nation`
- `provinces`
- `structures`
- `production`
- `assets`
- `formations`
- `actions`
- `gm`
- `reports`

## Shared UI Building Blocks

These should be lightweight reusable components, not a heavy design system effort up front.

- page shell
- data table
- summary card
- stat strip
- timeline list
- status badge
- action form section
- confirm dialog
- role guard
- loading and empty states

## Suggested Source Layout

```text
src/
  app/
  components/
  features/
  hooks/
  lib/
  routes/
  styles/
```

## Suggested Responsibility Split

### `app/`

Application bootstrap, providers, router setup.

### `components/`

Shared presentational components.

### `features/`

Feature-specific views, hooks, Firestore adapters, and form logic.

### `hooks/`

Cross-feature reusable React hooks.

### `lib/`

Firebase initialization, route helpers, constants, and pure utilities.

### `routes/`

Route components and layout assembly.

### `styles/`

Global styles, tokens, and layout primitives.

## State Management Guidance

Do not add a separate state-management library by default.

Use:

- React state for local UI state
- React context for session and auth context
- Firebase listeners and fetches for persisted state

If shared client state grows significantly later, reassess with evidence before introducing new tooling.

## UI Build Order

The first UI surfaces to build should be:

1. auth shell
2. session select
3. nation overview shell
4. GM dashboard shell
5. action submission shell

This gives the project navigable structure before deeper feature work begins.
