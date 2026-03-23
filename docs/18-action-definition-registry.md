# Shared Action Definition Registry

## Purpose

The application now uses a shared action-definition layer so player submission forms, action history labels, and GM review cards do not each carry their own copy of action-specific knowledge.

This is the bridge between:

- config-driven action tuning
- player-side request submission
- readable GM review surfaces
- future action-handler expansion

## Core Files

- [src/config/actionDefinitions.config.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/config/actionDefinitions.config.js)
- [src/features/actions/actionDefinitions.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/features/actions/actionDefinitions.js)
- [src/features/actions/actionService.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/features/actions/actionService.js)

## Architectural Split

### Config Layer

`actionDefinitions.config.js` is declarative.

It defines:

- action title
- initial status
- validation summary
- form fields
- queue meta field
- readable payload display fields
- GM reviewable action types and statuses

This is where most tuning should happen first.

### Behavior Layer

`actionDefinitions.js` converts those definitions into reusable helpers.

It owns:

- initial form state creation
- submission validation
- action document construction
- readable labels for action history
- readable payload rendering for the GM queue
- reviewable-action checks for GM dashboards

### Persistence Layer

`actionService.js` stays thin and Firestore-focused.

It now exposes `submitStructuredAction(...)`, which:

1. builds the action document from the shared definition layer
2. stamps timestamps
3. writes to Firestore

## Why This Matters

Without this layer, every new action type would require:

- new hardcoded form fields
- new hardcoded payload labels
- new hardcoded queue meta
- repeated status/title logic

With this layer, adding a new action type now follows a cleaner path:

1. add a new definition in `actionDefinitions.config.js`
2. add validation and payload-building behavior in `actionDefinitions.js`
3. add a GM or system handler if the action can be processed

That keeps the route files from turning into giant type-switching pages.

## Current Coverage

The registry currently drives:

- `REQUEST_NATION_CREATE`
- `REQUEST_NATION_JOIN`

These definitions are used by:

- the request-access player forms
- action history titles and statuses
- the GM action queue card headers and payload display

## Future Extensions

This pattern is intended to grow into:

- infrastructure placement requests
- production orders
- military action requests
- diplomatic proposals
- sanctions and GM override actions

The next logical improvement after this registry is a reusable action form component and route-level code splitting.
