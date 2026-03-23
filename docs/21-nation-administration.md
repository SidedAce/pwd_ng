# Nation Administration

## Purpose

The Nation Administration page is now a real control surface instead of a placeholder.

It is intended to give GMs one compact place to:

- select a nation in the active session
- change nation lifecycle status
- reassign primary ownership
- inspect the current membership roster

## Core Files

- [src/features/gm/useNationAdminData.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/features/gm/useNationAdminData.js)
- [src/config/nationAdmin.config.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/config/nationAdmin.config.js)
- [src/routes/pages.jsx](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/routes/pages.jsx)
- [src/features/actions/actionService.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/features/actions/actionService.js)

## Current Capabilities

The current page supports:

- nation selection within the active session
- nation status changes
- primary owner reassignment from active members
- automatic owner-role normalization on membership records
- roster review for all memberships tied to the selected nation

## Current Limitations

This page does not yet support:

- direct membership removal
- role editing beyond owner reassignment
- province reassignment
- nation merge/split workflows
- audit-log surfacing inside the admin page itself

Those can be layered on top of the same data-loading and update pattern.
