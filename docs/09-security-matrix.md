# PWD Security Matrix

## Purpose

This document defines the intended read and write boundaries before Firebase Security Rules are written.

## Role Model

Primary roles:

- unauthenticated visitor
- authenticated player
- authenticated GM
- authenticated admin

Campaign permissions should rely on both global role and session-specific membership.

## General Rule Set

- unauthenticated users should read only public landing content
- players should never directly write authoritative world-state collections
- GMs should operate through application workflows with broad authority
- admins may retain operational access, but the MVP should not depend on admin-only hidden workflows

## Collection Access Matrix

### `users`

Visitor:

- no read
- no write

Player:

- read own user document
- update limited own profile fields

GM:

- read user documents as needed for operations
- limited writes unless admin workflow requires more

## `sessions`

Visitor:

- no read by default

Player:

- read sessions they are a member of or sessions open for joining
- no direct writes

GM:

- full read
- write through GM tooling

## `nationMemberships`

Player:

- read membership rows that include themselves
- create limited join/request records if workflow uses this collection directly
- no arbitrary updates

GM:

- full read
- approve or revoke through tooling

## `nations`

Player:

- read own nation full operational data
- read limited public fields from other nations if exposed
- no direct writes to authoritative fields

GM:

- full read/write

## `provinces`

Player:

- read public province data and owned province operational data
- no direct writes

GM:

- full read/write

## `structures`

Player:

- read structures relevant to own nation and any intentionally public structures
- no direct writes

GM:

- full read/write

## `assetDesigns`

Player:

- read buildable designs allowed for their session
- no direct writes

GM:

- full read/write

## `productionOrders`

Player:

- read own nation orders
- no direct writes

GM:

- full read/write

## `assets`

Player:

- read own nation assets
- no direct writes

GM:

- full read/write

## `formations`

Player:

- read own nation formations
- no direct writes to authoritative records if actions are the mandated path

GM:

- full read/write

If we choose to let players directly edit limited formation metadata, that exception must be explicit in the rules and docs.

## `actions`

Player:

- create actions for allowed scopes
- read actions they submitted or actions belonging to their nation if allowed
- update only safe client-managed draft fields if such a pattern is introduced later

GM:

- full read
- write review and resolution fields through secure workflows

## `adjudications`

Player:

- read only adjudications exposed to their nation or marked public
- no write

GM:

- full read/write

## `worldEvents`

Player:

- read public events and nation-targeted visible events
- no write

GM:

- full read/write

## `auditLogs`

Player:

- no read by default
- no write

GM:

- read as needed for operations
- system or secure workflow writes

## `configs`

Player:

- read only safe public config if needed
- no write

GM:

- read/write through config tools

## Rule Design Guidance

Firebase Rules should check:

- authentication exists
- user role or claims
- session membership
- ownership of nation-scoped records
- visibility flags where relevant

Rules should not attempt to reproduce every game formula. Complex validation belongs in Cloud Functions.

## Locked Security Principles

- player state mutation enters through `actions`
- hidden information defaults to protected
- GM access is broad but should still flow through UI tools
- audit logs are not general player-facing records

## Open Decision To Confirm Later

We still need to decide whether `formations` are:

1. fully action-driven like all other critical systems
2. directly editable by players within narrow safe bounds

The architecture currently favors action-driven consistency.
