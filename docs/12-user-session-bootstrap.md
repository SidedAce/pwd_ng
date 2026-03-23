# PWD User And Session Bootstrap

## Purpose

This document describes the first Firestore-backed application bootstrap layer after authentication.

## Current Behavior

After a user signs in:

1. a user profile document is created or updated in `users`
2. active nation memberships are read from `nationMemberships`
3. related session documents are loaded from `sessions`
4. related nation documents are loaded from `nations`
5. the app stores an active session selection locally

## Files

### [src/features/app/AppDataProvider.jsx](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/features/app/AppDataProvider.jsx)

Owns profile bootstrap, membership loading, active session selection, and app-wide session context.

### [src/config/bootstrap.config.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/config/bootstrap.config.js)

Defines:

- collection names
- bootstrap role defaults
- GM-capable roles
- bootstrap admin emails
- local storage key names

## Bootstrap Role Rule

For early development, emails listed in `bootstrapAdminEmails` are created as `admin`. Everyone else defaults to `player`.

This is a temporary bootstrap rule until roles are managed fully through GM tooling and Firestore workflows.

## Route Gating

- `/app/*` requires authentication
- `/app/gm/*` requires a Firestore-backed profile role in the GM-capable role list

## Current Limits

- session reads are pull-based, not realtime listeners
- nation detail is limited to linked nation documents
- player-to-nation switching is not yet built
- no GM UI exists yet for managing profile roles or memberships
