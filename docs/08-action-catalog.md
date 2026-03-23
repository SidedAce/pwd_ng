# PWD Action Catalog

## Purpose

This document defines the MVP action types, their intent, and how they move through the authority pipeline.

## Action Design Rules

- every action must have a clear payload contract
- every action must define whether it is deterministic
- every action must define whether it can directly mutate state after validation
- every action must leave an audit trail

## Status Flow

Common action states:

- `pending`
- `auto_approved`
- `gm_review`
- `approved`
- `rejected`
- `processed`
- `failed`

## MVP Action Types

### `REQUEST_NATION_CREATE`

Purpose: request a new nation entry or campaign participation.

Submitted by: player

Deterministic: no

Default routing: GM review

Payload:

- `name`
- `ideology`
- `description`

Effects if approved:

- create nation
- create membership

## `PLACE_STRUCTURE`

Purpose: place a new structure in a province.

Submitted by: player

Deterministic: yes

Default routing: auto-approve if valid

Payload:

- `provinceId`
- `structureType`
- `name`

Validation:

- actor belongs to nation
- province belongs to nation
- slot capacity available
- treasury can cover cost
- structure type allowed

Effects if processed:

- create structure
- reduce treasury
- log audit event

## `START_PRODUCTION`

Purpose: start a production order.

Submitted by: player

Deterministic: yes

Default routing: auto-approve if valid

Payload:

- `designId`
- `facilityType`
- `quantity`

Validation:

- valid design
- nation has required facility capacity
- treasury can cover total cost
- quantity is within allowed limits

Effects if processed:

- create production order
- reduce treasury
- log audit event

## `CANCEL_PRODUCTION`

Purpose: cancel a running or queued production order.

Submitted by: player

Deterministic: yes

Default routing: auto-approve if valid

Payload:

- `productionOrderId`

Validation:

- order belongs to nation
- order status is cancellable

Effects if processed:

- mark order cancelled
- apply refund rule
- log audit event

## `CREATE_FORMATION`

Purpose: create a formation container.

Submitted by: player

Deterministic: yes

Default routing: auto-approve if valid

Payload:

- `name`
- `type`
- `provinceId`

Validation:

- province is valid for nation use
- name is present

Effects if processed:

- create formation
- log audit event

## `UPDATE_FORMATION`

Purpose: rename or edit metadata for a formation.

Submitted by: player

Deterministic: yes

Default routing: auto-approve if valid

Payload:

- `formationId`
- `name`
- `type`
- `notes`

Effects if processed:

- update formation metadata
- log audit event

## `ASSIGN_ASSETS_TO_FORMATION`

Purpose: assign stored assets to a formation.

Submitted by: player

Deterministic: yes

Default routing: auto-approve if valid

Payload:

- `formationId`
- `assetIds`

Validation:

- formation belongs to nation
- assets belong to nation
- assets are assignable

Effects if processed:

- update assets with formation assignment
- log audit event

## `REMOVE_ASSETS_FROM_FORMATION`

Purpose: remove assigned assets from a formation.

Submitted by: player

Deterministic: yes

Default routing: auto-approve if valid

Payload:

- `formationId`
- `assetIds`

Effects if processed:

- clear asset assignment
- log audit event

## `MOVE_FORMATION`

Purpose: relocate a formation to a new province.

Submitted by: player

Deterministic: mostly yes for MVP

Default routing: auto-approve if valid unless future movement rules require review

Payload:

- `formationId`
- `destinationProvinceId`

Validation:

- formation belongs to nation
- destination is valid under current movement rules

Effects if processed:

- update formation province
- optionally sync assigned asset location policy
- log audit event

## `SEND_DIPLOMATIC_MESSAGE`

Purpose: submit structured diplomacy or negotiation intent.

Submitted by: player

Deterministic: no

Default routing: GM review or recorded delivery depending on final diplomacy design

Payload:

- `targetNationId`
- `subject`
- `body`

Effects:

- create diplomatic record or routed event

## `REQUEST_MILITARY_ACTION`

Purpose: request combat, invasion, deployment, strike, or other military action.

Submitted by: player

Deterministic: no

Default routing: GM review

Payload:

- `actionSubtype`
- `formationIds`
- `targetProvinceId`
- `objective`
- `notes`

Effects if approved:

- no automatic outcome simulation
- adjudication required

## `GM_WORLD_EDIT`

Purpose: explicit GM override or emergency world edit.

Submitted by: GM

Deterministic: GM-authoritative

Default routing: approved

Payload:

- `entityType`
- `entityId`
- `changeSet`
- `reason`

Effects:

- update authoritative state
- create audit log
- optionally create world event

## `GM_ADJUDICATE_ACTION`

Purpose: resolve a queued or contested action.

Submitted by: GM

Deterministic: GM-authoritative

Default routing: approved

Payload:

- `targetActionId`
- `decision`
- `summary`
- `effects`

Effects:

- create adjudication record
- process resulting state changes
- log audit event

## Immediate Implementation Priority

The first action types we should implement are:

1. `REQUEST_NATION_CREATE`
2. `PLACE_STRUCTURE`
3. `START_PRODUCTION`
4. `CREATE_FORMATION`
5. `ASSIGN_ASSETS_TO_FORMATION`
6. `REQUEST_MILITARY_ACTION`
7. `GM_ADJUDICATE_ACTION`

## Action Contract Rule

Before implementing any action, we should define:

- payload schema
- validation rules
- mutation targets
- audit behavior
- player-visible status behavior
