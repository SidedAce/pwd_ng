# PWD Auth Foundation

## Purpose

This document describes the first authentication layer added to the app shell.

## Current Behavior

- Firebase Auth is initialized in [src/lib/firebase.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/lib/firebase.js)
- auth state is shared through [src/features/auth/AuthProvider.jsx](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/features/auth/AuthProvider.jsx)
- protected routes are enforced by [src/features/auth/ProtectedRoute.jsx](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/features/auth/ProtectedRoute.jsx)
- `/app` routes now require an authenticated user
- `/login` now provides a working Google sign-in button

## Config Surface

Authentication settings live in [src/config/auth.config.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/config/auth.config.js).

This currently controls:

- enabled auth providers
- login page copy
- route protection redirects

## Current Assumption

The app starts with Google sign-in because it is the fastest Firebase-native provider for Phase 1.

## Firebase Requirement

For sign-in to work, Google must be enabled in:

Firebase Console -> Authentication -> Sign-in method

## What This Does Not Yet Do

- assign PWD roles from Firestore
- load session memberships
- gate GM routes separately from player routes
- create user profile documents automatically

Those are the next auth-adjacent steps after this foundation.
