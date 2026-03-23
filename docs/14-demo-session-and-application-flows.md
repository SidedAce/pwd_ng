# PWD Demo Session And Application Flows

## Purpose

This document describes the seeded demo data and the split between nation creation and nation join requests.

## Demo Seed

When a GM-capable bootstrap account signs in, the app ensures:

- a public demo session exists
- a demo nation exists inside that session

This is configured in [src/config/bootstrap.config.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/config/bootstrap.config.js).

## Application Rule

The nation application exists for players who want to lead their own nation.

The current fields are:

- nation name
- flag URL
- primary leader
- assistant leader 1
- assistant leader 2
- government type
- ideology
- lore

These are defined in [src/config/action.config.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/config/action.config.js).

## Join Existing Nation Rule

Players who want to join an already existing nation use a separate join request flow instead of the nation application.

That flow currently writes a `REQUEST_NATION_JOIN` action into Firestore.

## Current Demo Outcome

With the seeded demo session and demo nation in place, you can now demonstrate:

- creating a brand-new nation application
- requesting to join an existing placeholder nation
- seeing both requests appear in action history
