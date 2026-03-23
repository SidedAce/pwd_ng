# Nation Comparison Workbench

## Purpose

The nation reports surface now provides a compact nation comparison tool instead of a button-heavy placeholder.

The workbench is built for:

- fast nation selection
- category switching through dropdowns
- side-by-side comparison of two nations
- simultaneous comparison of two different categories
- military quantity review alongside economy and territory

## Core Files

- [src/config/nationComparison.config.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/config/nationComparison.config.js)
- [src/features/gm/useNationDirectory.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/features/gm/useNationDirectory.js)
- [src/components/NationComparisonWorkbench.jsx](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/components/NationComparisonWorkbench.jsx)
- [src/routes/pages.jsx](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/routes/pages.jsx)
- [src/config/navigation.config.js](/C:/Users/Sided/OneDrive/Documents/pwd_ng/src/config/navigation.config.js)

## Interaction Model

Each comparison column has two compact controls:

- target nation dropdown
- data category dropdown

This makes the panel much faster to use for repeated comparisons than a larger card-button selection layout.

## Current Categories

The current config includes:

- identity
- economy
- territory
- military
- oversight

All category labels and fields are driven from config.

## Extension Path

To add a new comparison slice:

1. add a category to `nationComparison.config.js`
2. define the fields to display
3. the workbench will surface it automatically in the category dropdowns

This keeps future report growth mostly in the config layer instead of requiring a fresh page design each time.
