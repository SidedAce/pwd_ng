# PWD Nation Lifecycle Foundation

## Purpose

This document covers the first end-to-end player gameplay pipeline: nation creation requests.

## Current Flow

1. authenticated player opens `/request-access`
2. app loads public sessions from `sessions` where `isPublicJoinEnabled == true`
3. player fills out the nation request form
4. app writes a `REQUEST_NATION_CREATE` document into `actions`
5. player can view the submitted request in `/app/actions`

## Current Action Shape

The request writes:

- `sessionId`
- `nationId: null`
- `type: "REQUEST_NATION_CREATE"`
- `status: "gm_review"`
- `submittedBy`
- `submittedByRole`
- `payload.name`
- `payload.ideology`
- `payload.description`
- `payload.requestedSessionId`
- `validationSummary`
- `resolutionSummary`
- `autoApproved`
- `requiresGmReview`
- `relatedEntityIds`
- `createdAt`
- `updatedAt`

## Files

### [src/config/action.config.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/config/action.config.js)

Defines action metadata and labels for the new flow.

### [src/features/actions/useUserActions.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/features/actions/useUserActions.js)

Loads player-visible action history from Firestore.

### [src/routes/pages.jsx](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/routes/pages.jsx)

Contains the current nation request form and action history UI.

## What This Enables

- real player intent stored in Firestore
- real action history entries
- a concrete GM review target for future GM queue work

## What Still Comes Next

- GM approval UI for `REQUEST_NATION_CREATE`
- creation of `nations` and `nationMemberships` on approval
- validation rules and Cloud Function processing
- duplicate-request prevention and richer form validation
