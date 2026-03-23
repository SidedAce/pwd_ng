# PWD System Architecture

## Architecture Goal

The architecture must preserve a strict separation between player intent, deterministic processing, GM authority, and authoritative world state.

## High-Level Model

### Client

The web client is responsible for:

- authentication
- role-aware UI
- dashboards and forms
- report presentation
- action submission

The client should never be trusted as the source of truth for critical game state.

### Backend

Firebase backend responsibilities:

- Firestore for persistent state
- Firebase Auth for users and roles
- Cloud Functions for validation, scheduled jobs, and state transitions
- Security Rules for access boundaries

## Core Architectural Rule

Players do not write directly to critical collections like `assets`, `productionOrders`, `structures`, or nation economy fields.

Players submit intent to `actions`.

Backend processors or GM actions convert approved intent into authoritative state changes.

## State Layers

### Layer 1: Intent

`actions`

This is where player or GM requests are recorded before effects are finalized.

### Layer 2: Authority

`adjudications`

This records GM decisions, overrides, and final determinations for contested actions.

### Layer 3: Authoritative State

Core collections such as:

- `nations`
- `provinces`
- `structures`
- `productionOrders`
- `assets`
- `formations`

### Layer 4: Audit And History

- `auditLogs`
- `worldEvents`

These provide traceability and readable campaign history.

## Firestore Collections

### Core Collections

- `users`
- `sessions`
- `nations`
- `nationMemberships`
- `provinces`
- `structures`
- `productionOrders`
- `assetDesigns`
- `assets`
- `formations`
- `actions`
- `adjudications`
- `worldEvents`
- `auditLogs`
- `configs`

## Recommended Collection Responsibilities

### `users`

Identity, profile, and global roles.

### `sessions`

Campaign/session-level metadata, status, and configuration references.

### `nations`

Nation identity and authoritative nation-level economic and political state.

### `nationMemberships`

Which users belong to which nations and with what permissions.

### `provinces`

Province ownership and static location metadata.

### `structures`

Built infrastructure instances located in provinces.

### `productionOrders`

Authoritative queued or active production records.

### `assetDesigns`

Definitions for buildable asset types.

### `assets`

Authoritative inventory and deployed quantities by design, location, and formation assignment.

### `formations`

Player-manageable organization layer required for deployment and command structure.

### `actions`

Structured requests made by players or GMs.

### `adjudications`

GM decision records attached to actions or conflicts.

### `worldEvents`

Readable campaign timeline entries.

### `auditLogs`

Low-level compliance and trace history for changes.

### `configs`

Global balancing parameters and game rules that need runtime access.

## Data Modeling Rules

- Store authoritative state in explicit collections, not in derived UI caches.
- Derived values should be recalculable from stored state and config.
- Prefer append-only history for logs and events.
- Keep player-editable profile metadata separate from authoritative nation state.
- Avoid duplicating sensitive intelligence data into player-readable documents.

## Action Processing Pipeline

### Step 1: Submission

A player creates an `actions` document containing:

- action type
- actor identity
- nation context
- structured payload
- timestamps

### Step 2: Validation

A Cloud Function validates:

- permission to act
- funds or slot availability
- target existence
- action payload integrity

### Step 3: Routing

If deterministic and valid, the action may be auto-approved.

If contested, sensitive, or non-deterministic, it moves to GM review.

### Step 4: Resolution

Resolution creates or updates authoritative records and emits:

- audit log entries
- optional world events
- optional adjudication records

### Step 5: Visibility

Player-facing reads expose only what that role should see.

## Visibility Model

Default assumption: information is hidden unless intentionally exposed.

### Player View

- full access to own nation operational data
- limited access to public world data
- enemy information only when explicitly revealed or estimated

### GM View

- unrestricted read/write access through application tooling

## Scheduled Systems

The backend will require scheduled jobs for:

- daily economy tick
- production completion processing
- optional upkeep or overflow penalties
- recurring maintenance checks

## Reporting Model

Reports should be generated from authoritative data and config, not from manually curated spreadsheets.

Initial report categories:

- infrastructure comparison
- economy comparison
- military totals
- formation breakdown
- production capacity

## Implementation Guardrails

- No raw document editing as the expected GM workflow
- No client-side authority over irreversible state changes
- No hidden logic that exists only in UI code
- No report that depends on hand-maintained duplicate data
