# PWD Config Framework

## Purpose

This document explains the early config-first framework now used by the app shell. The goal is to keep the project easy to tune and understandable before deeper gameplay systems are implemented.

## Philosophy

We prefer changing:

- JavaScript config files
- JSON-like data structures
- documented constants

over scattering values across route files, UI components, and raw styling.

## Current Config Modules

### [src/config/game.config.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/config/game.config.js)

Gameplay and system tuning values.

Examples:

- cancellation refund rate
- default visibility behavior
- structure type list
- action routing categories

### [src/config/theme.config.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/config/theme.config.js)

Theme tokens stored in JavaScript. CSS reads these through variables so visual tuning stays centralized.

### [src/config/navigation.config.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/config/navigation.config.js)

Top-level navigation definitions for public, shared, nation, and GM spaces.

### [src/config/layoutContent.config.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/config/layoutContent.config.js)

Shell and layout copy for the major app surfaces.

### [src/config/pageContent.config.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/config/pageContent.config.js)

Declarative page content used by the current scaffold pages.

### [src/config/routeManifest.config.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/config/routeManifest.config.js)

Named route map so path structure is visible and documented in one place.

## Supporting Framework Pieces

### [src/app/theme.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/app/theme.js)

Applies theme config values to CSS variables.

### [src/components/PageSection.jsx](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/components/PageSection.jsx)

Generic section and stat rendering helpers used by config-driven pages.

### [src/components/ConfigCardGrid.jsx](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/components/ConfigCardGrid.jsx)

Reusable card grid renderer for config-defined links and summaries.

## Working Rule Going Forward

When adding a new subsystem, define its initial constants and display copy in config first when practical.

Good candidates:

- action metadata
- nation dashboard summary definitions
- GM queue categories
- report labels and sections
- economy tuning values
- validation thresholds

## What Should Still Live In Code

Not everything should become config.

Logic should remain in code when it is:

- branching behavior
- validation procedure
- data fetching orchestration
- mutation workflow
- access control enforcement

## What Should Stay Thin In CSS

CSS should mostly contain:

- layout rules
- variable consumption
- responsive behavior
- component structure

Theme values should prefer config-backed variables when possible.
