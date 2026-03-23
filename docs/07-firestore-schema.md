# PWD Firestore Schema

## Purpose

This document turns the collection list into field-level contracts aligned with the authority model.

## Schema Rules

- `createdAt` and `updatedAt` should exist on most mutable records.
- document ids should be stable and human-legible where practical.
- enum-like fields should use documented string constants.
- sensitive GM-only data should not live in documents broadly readable by players.
- derived values may be stored for performance only when recalculable.

## `users`

Purpose: global identity and lightweight profile.

Suggested fields:

- `displayName`: string
- `email`: string
- `photoUrl`: string | null
- `globalRole`: `"player"` | `"gm"` | `"admin"`
- `status`: `"active"` | `"disabled"`
- `createdAt`: timestamp
- `updatedAt`: timestamp

## `sessions`

Purpose: campaign instances.

Suggested fields:

- `name`: string
- `slug`: string
- `description`: string
- `status`: `"draft"` | `"active"` | `"paused"` | `"archived"`
- `currentDay`: number
- `tickTimezone`: string
- `tickHour`: number
- `isPublicJoinEnabled`: boolean
- `createdBy`: userId
- `createdAt`: timestamp
- `updatedAt`: timestamp

## `nationMemberships`

Purpose: connect users to nations inside sessions.

Suggested fields:

- `sessionId`: sessionId
- `nationId`: nationId
- `userId`: userId
- `role`: `"owner"` | `"officer"` | `"viewer"`
- `status`: `"pending"` | `"active"` | `"revoked"`
- `createdAt`: timestamp
- `updatedAt`: timestamp

## `nations`

Purpose: authoritative nation state.

Suggested fields:

- `sessionId`: sessionId
- `name`: string
- `slug`: string
- `ideology`: string
- `description`: string
- `status`: `"pending"` | `"active"` | `"defeated"` | `"inactive"`
- `treasury`: number
- `hiddenTreasuryDelta`: number
- `publicNotes`: string
- `gmNotes`: string
- `ownerUserIds`: string[]
- `provinceIds`: string[]
- `tags`: string[]
- `createdAt`: timestamp
- `updatedAt`: timestamp

Stored derived summary fields allowed if recalculable:

- `dailyIncome`
- `structureCount`
- `assetCount`

## `provinces`

Purpose: map subdivisions and ownership.

Suggested fields:

- `sessionId`: sessionId
- `name`: string
- `slug`: string
- `region`: string
- `ownerNationId`: nationId | null
- `slotCapacity`: number
- `terrain`: string
- `isCapital`: boolean
- `publicDescription`: string
- `gmNotes`: string
- `createdAt`: timestamp
- `updatedAt`: timestamp

## `structures`

Purpose: infrastructure instances inside provinces.

Suggested fields:

- `sessionId`: sessionId
- `nationId`: nationId
- `provinceId`: provinceId
- `type`: `"factory"` | `"factory_complex"` | `"port"` | `"drydock"` | `"airbase"` | `"radar"` | `"space_launch_complex"` | `"special_project"`
- `name`: string
- `level`: number
- `status`: `"active"` | `"damaged"` | `"destroyed"` | `"inactive"`
- `slotCost`: number
- `buildCost`: number
- `incomeContribution`: number
- `notes`: string
- `createdFromActionId`: actionId
- `createdAt`: timestamp
- `updatedAt`: timestamp

## `assetDesigns`

Purpose: buildable asset definitions.

Suggested fields:

- `sessionId`: sessionId
- `key`: string
- `name`: string
- `category`: `"land"` | `"air"` | `"naval"` | `"strategic"` | `"support"`
- `facilityType`: string
- `buildCost`: number
- `buildTimeDays`: number
- `storageClass`: string
- `upkeepCost`: number
- `isActive`: boolean
- `publicDescription`: string
- `gmNotes`: string
- `createdAt`: timestamp
- `updatedAt`: timestamp

## `productionOrders`

Purpose: authoritative production queue.

Suggested fields:

- `sessionId`: sessionId
- `nationId`: nationId
- `designId`: designId
- `facilityType`: string
- `quantity`: number
- `unitCostSnapshot`: number
- `totalCostSnapshot`: number
- `startedAt`: timestamp
- `completionAt`: timestamp
- `status`: `"queued"` | `"in_progress"` | `"completed"` | `"cancelled"` | `"paused"`
- `createdFromActionId`: actionId
- `cancelRefundAmount`: number
- `createdAt`: timestamp
- `updatedAt`: timestamp

## `assets`

Purpose: authoritative inventory units or grouped asset records.

Suggested fields:

- `sessionId`: sessionId
- `nationId`: nationId
- `designId`: designId
- `quantity`: number
- `status`: `"stored"` | `"deployed"` | `"damaged"` | `"destroyed"`
- `assignedFormationId`: formationId | null
- `locationProvinceId`: provinceId | null
- `visibilityState`: `"hidden"` | `"estimated"` | `"revealed"`
- `createdFromProductionOrderId`: productionOrderId | null
- `createdAt`: timestamp
- `updatedAt`: timestamp

## `formations`

Purpose: organize deployable assets.

Suggested fields:

- `sessionId`: sessionId
- `nationId`: nationId
- `name`: string
- `slug`: string
- `type`: string
- `provinceId`: provinceId | null
- `status`: `"active"` | `"reserve"` | `"destroyed"`
- `commanderName`: string
- `notes`: string
- `createdAt`: timestamp
- `updatedAt`: timestamp

Possible future optimization:

- `assetIds`: string[]

For MVP, prefer deriving formation composition by querying assets using `assignedFormationId` to avoid dual-write drift.

## `actions`

Purpose: player or GM intent submission.

Suggested fields:

- `sessionId`: sessionId
- `nationId`: nationId | null
- `type`: string
- `status`: `"pending"` | `"auto_approved"` | `"gm_review"` | `"approved"` | `"rejected"` | `"processed"` | `"failed"`
- `submittedBy`: userId
- `submittedByRole`: string
- `payload`: map
- `validationSummary`: string
- `resolutionSummary`: string
- `autoApproved`: boolean
- `requiresGmReview`: boolean
- `relatedEntityIds`: string[]
- `createdAt`: timestamp
- `updatedAt`: timestamp

## `adjudications`

Purpose: GM resolution records.

Suggested fields:

- `sessionId`: sessionId
- `actionId`: actionId
- `nationId`: nationId | null
- `decision`: `"approved"` | `"rejected"` | `"partial"` | `"override"`
- `summary`: string
- `gmUserId`: userId
- `effects`: map
- `createdAt`: timestamp
- `updatedAt`: timestamp

## `worldEvents`

Purpose: readable world timeline.

Suggested fields:

- `sessionId`: sessionId
- `type`: string
- `title`: string
- `body`: string
- `visibility`: `"public"` | `"nation_only"` | `"gm_only"`
- `targetNationIds`: string[]
- `relatedActionId`: actionId | null
- `createdBy`: userId
- `createdAt`: timestamp

## `auditLogs`

Purpose: low-level trace log for authoritative changes.

Suggested fields:

- `sessionId`: sessionId
- `actorUserId`: userId | null
- `actorType`: `"player"` | `"gm"` | `"system"`
- `actionId`: actionId | null
- `entityType`: string
- `entityId`: string
- `operation`: `"create"` | `"update"` | `"delete"` | `"process"`
- `before`: map | null
- `after`: map | null
- `summary`: string
- `createdAt`: timestamp

## `configs`

Purpose: runtime-adjustable game settings.

Suggested fields:

- `sessionId`: sessionId
- `key`: string
- `category`: `"economy"` | `"production"` | `"visibility"` | `"rules"` | `"reports"`
- `value`: map
- `description`: string
- `updatedBy`: userId
- `createdAt`: timestamp
- `updatedAt`: timestamp

## Indexing Notes

Likely composite indexes will be needed for:

- `actions` by `sessionId + status + createdAt`
- `nationMemberships` by `userId + sessionId + status`
- `provinces` by `sessionId + ownerNationId`
- `structures` by `sessionId + nationId`
- `assets` by `sessionId + nationId + assignedFormationId`
- `productionOrders` by `sessionId + nationId + status`
- `worldEvents` by `sessionId + visibility + createdAt`

## Modeling Decisions Locked For Now

- `actions` is the write path for player intent.
- `formations` should not be the primary store of asset membership.
- hidden GM notes should remain separate from general public-facing text.
- authoritative records should carry source action ids where possible.
