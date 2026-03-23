# PWD Product And Scope

## Purpose

PWD is a persistent multiplayer geopolitical simulation played over multi-month sessions. The platform exists to support state tracking, structured player actions, GM adjudication, hidden information, and report generation.

This is not a real-time strategy game and not a combat simulator. The application is a campaign operations system with a web interface.

## Product Vision

Players should be able to manage nations, organize assets, submit meaningful actions, and react to world developments while GMs retain full authority over uncertain or contested outcomes.

The software should reduce administrative overhead, improve consistency, and make the world state legible without removing the roleplay and judgment layer.

## Design Pillars

- Persistence across long-running sessions
- Structured player agency
- GM authority over outcomes
- Controlled visibility and intelligence
- Data-driven comparisons and reporting
- Auditable history of actions and world changes

## Core Loop

### World Loop

Infrastructure -> Income -> Production -> Asset Creation -> Organization -> Action -> Adjudication -> World Update -> Repeat

### Player Loop

Log in -> Review nation -> Coordinate -> Submit actions -> Wait for updates -> Respond -> Repeat

## Authority Boundaries

### Players

Players do not directly edit authoritative world state.

Players can:

- submit actions
- spend funds through valid action paths
- manage formations and organizational structure
- participate in diplomacy and roleplay

### System

The system is responsible for deterministic enforcement and calculations.

The system validates or calculates:

- budget sufficiency
- slot and infrastructure limits
- production eligibility
- time-based completion
- reports and comparisons
- audit records

### GMs

GMs are authoritative over any non-deterministic or disputed outcome.

GMs control:

- military adjudication
- destruction and losses
- sanctions and exceptional modifiers
- intelligence visibility and estimates
- emergency world edits
- event injection and narrative interventions

## MVP Scope

The MVP should support one full campaign cycle at a basic but usable level.

### Included In MVP

- authentication and role-aware access
- session creation and management
- nation application and approval
- read-only nation dashboard
- provinces and structure placement
- action submission and processing pipeline
- economy tick
- production orders
- asset registry
- formations
- GM action queue
- GM world edit tools
- event feed
- baseline comparison reports

### Explicitly Deferred

- real-time combat simulation
- advanced map interaction beyond required management views
- highly granular logistics simulation
- player-authored modding systems
- public API for third-party clients

## Success Criteria

The product is ready for initial live use when:

- a GM can run a session without touching raw Firestore documents
- a player can complete a full nation management cycle through the UI
- every material state change is auditable
- hidden information remains role-correct
- reports can be generated from stored state without manual spreadsheets

## Non-Goals

- replacing GM judgment with simulation
- exposing all data to all players
- optimizing early for cosmetic polish over operational clarity
