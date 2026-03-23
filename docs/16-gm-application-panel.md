# PWD GM Application Panel

## Purpose

This document describes the first operational GM decision panel in the app.

## Current Scope

The GM queue currently handles:

- `REQUEST_NATION_CREATE`
- `REQUEST_NATION_JOIN`

## Current Behavior

GMs can:

- open `/app/gm/actions`
- view reviewable applications
- expand each application for full payload details
- approve or reject the request

## Approval Effects

### Nation Creation Approval

Approving `REQUEST_NATION_CREATE`:

- creates a `nations` document
- creates an owner `nationMemberships` document
- updates the action to `approved`
- creates an `adjudications` record

### Nation Join Approval

Approving `REQUEST_NATION_JOIN`:

- creates or updates an active `nationMemberships` document
- updates the action to `approved`
- creates an `adjudications` record

### Rejection

Rejecting either request:

- updates the action to `rejected`
- creates an `adjudications` record

## Files

### [src/features/gm/useGmApplications.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/features/gm/useGmApplications.js)

Loads GM-reviewable application actions.

### [src/features/gm/processApplicationDecision.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/features/gm/processApplicationDecision.js)

Owns the approval and rejection mutation flow.

### [src/routes/pages.jsx](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/routes/pages.jsx)

Renders the queue panel UI.

## Why This Matters

This is the first real GM authority surface. It establishes the pattern that player intent enters through `actions`, and GM decisions convert those requests into authoritative state changes through a readable operational panel.
