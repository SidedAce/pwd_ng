# PWD Firestore Setup

## Purpose

This document covers the minimum Firestore setup required for the current app shell and demo flows to function.

## Current Requirement

The app now reads and writes:

- `users`
- `sessions`
- `nations`
- `nationMemberships`
- `actions`

So Firestore must exist and must permit authenticated reads and writes during development.

## Development Rules

The repository now includes:

- [firestore.rules](/C:/Users/Sided/OneDrive/Documents/pwd_ng/firestore.rules)
- [firestore.indexes.json](/C:/Users/Sided/OneDrive/Documents/pwd_ng/firestore.indexes.json)

These development rules allow any authenticated user to read and write for now.

## How To Publish Them

Run:

```powershell
npm run deploy:firestore
```

Or deploy from Firebase CLI with:

```powershell
firebase deploy --only firestore
```

## Important Warning

These are not final production rules.

They exist only to unblock:

- auth bootstrap
- demo session seeding
- nation application submission
- join request submission

We should replace them with collection-specific rules once the GM flow and action pipeline are further along.
