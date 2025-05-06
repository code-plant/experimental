# Test

Development test project.

The current stage of this project is in active development. As such, commits may not be granular, and changes may not always be tracked in fine detail.

## Prerequisites

1. Use [mise](https://mise.jdx.dev).  
    Don't have mise? Check `mise.toml` and install them manually.
2. Install yarn: `npm i -g corepack && corepack enable && corepack install -g yarn`.

## Getting Started

> WORK IN PROGRESS. DOES NOT WORK YET.

```sh
just init
just
```

See `Justfile` recipes.

## Goals

This repository is for developing/testing experimental packages such as the following:

- GraphQL client with type-level parser/analyzer, like `gql.tada` but with `@include`/`@skip` support and more
- Strongly typed GraphQL server framework with strict type checking (in contrast to `type-graphql`)
- Command-line arguments parser with type-level invalid option detection
- Markdown/MDX alternative document format that supports plugins, section termination, rich structured data, etc.
- TailwindCSS alternative utility class generator without a huge initial bundle size, and with much more robust dark mode/interactive/group support, etc.

### Features

- User login
- Post, comment
- User group and role, access control to posts
- Approval system for sharing posts with other entities

## Development Notes

Currently, all packages are nested three levels deep in the `packages/` directory.  
For example: `packages/a/b/c`.

All `*.js` and `[!_]*.d.ts` files are excluded from Git and VS Code.  
Therefore, if you need to include a `.d.ts` file, make sure it starts with an underscore (e.g., `_declarations.d.ts`).

If type errors occur because of residual `.d.ts` files, use the command below:

```sh
just clean
```

## Brief Structure

> Note: Actual directory structure may not match yet

- `application` - Shared, application-specific packages
  - `api` - API specification between backend/frontend
  - `logic` - Common logic between backend/frontend
- `backend` - Backend-specific packages
  - `adapters` - Adapter implementations
  - `application` - Core business logic
  - `data` - Data layer
  - `scripts` - Runnable scripts, such as server start
  - `util` - Backend-specific utilities
- `development` - Used only for development
  - `codegen` - For code generation
  - `scripts` - Scripts for development
  - `util` - Utilities for `development/*` packages
- `editor` - MDCode: Markdown alternative document format
  - `core` - Essential packages to handle the document
  - `plugins`
  - `react` - Renderer and renderer plugins for React
- `frontend` - Frontend-specific packages
  - `apps` - Next.js apps
  - `components` - React components
  - `util` - Utilities only for frontend
- `graphql` - GraphQL tools like runtime/type-level parser
  - `common` - Shared components between server/client
  - `client`
  - `server`
  - `types` - Core types and type-level parser/analyzer, etc.
- `util` - Basic unopinionated utilities
  - `atomic` - Utilities in the smallest unit
  - `client` - Type-checked REST/GraphQL/JSON-RPC/etc. client
  - `types` - Type-only utilities
- `viuc` - Very Interactive Utility Classes: TailwindCSS alternative
  - `main`
  - `type-plugins` - Plugins for types such as `bg-[color]`
  - `variant-plugins` - Plugins for variants such as `focus:`
