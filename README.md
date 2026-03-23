# PWD Planning Repository

This repository is the planning and specification source of truth for **PWD (Politics, War, Droods)** before implementation begins.

The goal of this phase is to remove ambiguity before code exists. We will define:
- the game design and product scope
- the system architecture and authority boundaries
- the data model and backend workflow
- the delivery phases and build order
- the rules for how future implementation work should be documented

## Document Index

- [docs/01-product-and-scope.md](/C:/Users/Sided/OneDrive/Documents/pwd_ng/docs/01-product-and-scope.md)
- [docs/02-system-architecture.md](/C:/Users/Sided/OneDrive/Documents/pwd_ng/docs/02-system-architecture.md)
- [docs/03-phased-roadmap.md](/C:/Users/Sided/OneDrive/Documents/pwd_ng/docs/03-phased-roadmap.md)
- [docs/04-delivery-workflow.md](/C:/Users/Sided/OneDrive/Documents/pwd_ng/docs/04-delivery-workflow.md)
- [docs/05-app-structure.md](/C:/Users/Sided/OneDrive/Documents/pwd_ng/docs/05-app-structure.md)
- [docs/06-firebase-architecture.md](/C:/Users/Sided/OneDrive/Documents/pwd_ng/docs/06-firebase-architecture.md)
- [docs/07-firestore-schema.md](/C:/Users/Sided/OneDrive/Documents/pwd_ng/docs/07-firestore-schema.md)
- [docs/08-action-catalog.md](/C:/Users/Sided/OneDrive/Documents/pwd_ng/docs/08-action-catalog.md)
- [docs/09-security-matrix.md](/C:/Users/Sided/OneDrive/Documents/pwd_ng/docs/09-security-matrix.md)

## Planning Principles

- No implementation starts until the affected system has a written spec.
- Player intent and authoritative state are separate concerns.
- GM tooling is a first-class product surface, not an admin afterthought.
- Every phase must produce usable software and updated documentation.
- Any change to core rules, schema, or authority boundaries should be documented before code changes land.

## Immediate Outcome Of This Repo

This repo now serves as the project planning baseline. The next step after review is to break Phase 1 into concrete implementation tickets and then scaffold the application around the approved architecture.

## Starter App And Deploy

The repo now also includes a minimal Vite/React starter with Firebase bootstrap and Firebase Hosting deploy automation via GitHub Actions.

To finish the setup:

1. Copy `.env.example` to `.env` and fill in your Firebase web app values.
2. Replace `your-firebase-project-id` in [.firebaserc](/C:/Users/Sided/OneDrive/Documents/pwd_ng/.firebaserc).
3. Add these GitHub repository secrets:
   `VITE_FIREBASE_API_KEY`
   `VITE_FIREBASE_AUTH_DOMAIN`
   `VITE_FIREBASE_PROJECT_ID`
   `VITE_FIREBASE_STORAGE_BUCKET`
   `VITE_FIREBASE_MESSAGING_SENDER_ID`
   `VITE_FIREBASE_APP_ID`
   `FIREBASE_SERVICE_ACCOUNT`
4. Push to `main` and the workflow in [.github/workflows/firebase-hosting.yml](/C:/Users/Sided/OneDrive/Documents/pwd_ng/.github/workflows/firebase-hosting.yml) will build and deploy automatically.
