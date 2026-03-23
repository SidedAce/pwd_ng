# PWD Action Handler Architecture

## Purpose

This document explains the strengthened action-processing architecture introduced for GM decisions.

## Why It Exists

The project is going to accumulate many more action types. If all approval logic lives in one page or one large processor file, the system will become brittle quickly.

## Current Structure

### [src/features/actions/actionService.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/features/actions/actionService.js)

Shared Firestore operations for actions and related records.

### [src/features/actions/actionTypes.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/features/actions/actionTypes.js)

Shared action type constants.

### [src/features/gm/decisionHandlers/registry.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/features/gm/decisionHandlers/registry.js)

Maps action types to decision handlers.

### [src/features/gm/decisionHandlers/nationCreateHandler.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/features/gm/decisionHandlers/nationCreateHandler.js)

Owns nation creation approval behavior.

### [src/features/gm/decisionHandlers/nationJoinHandler.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/features/gm/decisionHandlers/nationJoinHandler.js)

Owns join request approval behavior.

### [src/features/gm/decisionHandlers/shared.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/features/gm/decisionHandlers/shared.js)

Owns shared rejection behavior.

### [src/features/gm/processApplicationDecision.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/features/gm/processApplicationDecision.js)

Thin orchestration layer that dispatches to handlers rather than owning all logic itself.

## Scaling Pattern

For each new action type:

1. add or confirm action metadata in config
2. create a dedicated handler module
3. register the handler
4. let the queue and decision UI stay generic

## Benefit

This keeps future growth additive. New gameplay systems can join the same approval pipeline without forcing a rewrite of the GM panel or one giant conditional chain.
