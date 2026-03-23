# GM Key Elevation

## Purpose

GM access can now be granted through a statically configured 6-digit key on the login page.

This is intended for early-stage controlled access while the broader staff and permissions system is still being built.

## Core Files

- [src/config/auth.config.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/config/auth.config.js)
- [src/features/app/AppDataProvider.jsx](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/features/app/AppDataProvider.jsx)
- [src/routes/pages.jsx](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/routes/pages.jsx)
- [src/routes/layouts.jsx](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/routes/layouts.jsx)

## Configuration

The GM key lives in `authConfig.adminKeyAccess`.

It currently defines:

- whether key elevation is enabled
- the static key value
- required digit count
- the elevated role applied after success
- the elevation source label used in profile metadata

## Profile Model

User profiles now distinguish between:

- `baseGlobalRole`
- `gmElevation`
- effective `globalRole`

This matters because a GM key should elevate access without destroying the underlying base role.

## Effective Role Rules

1. `baseGlobalRole` remains the underlying role for the profile.
2. If `gmElevation.isActive` is true, the effective role becomes the configured elevated role.
3. If elevation is cleared, the profile returns to `baseGlobalRole`.

## User Flow

1. User signs in with Firebase Auth.
2. User enters the 6-digit key on the login page.
3. If the key matches config, the profile is updated in Firestore.
4. GM routes unlock because effective role now satisfies GM access checks.

## Self-Revoke Flow

If access was granted through the key, the user can remove that elevation.

The remove action appears in:

- the login page
- the authenticated app header

Removing elevation restores the profile to its base role.

## Important Limitation

This is intentionally config-driven and client-visible for now.

That means it is suitable for early-stage internal use, but it is not the final secure permissions model.

A later phase should move elevation or privileged role grants into a GM-only server-controlled workflow.
