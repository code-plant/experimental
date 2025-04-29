# Test

Development test project.

The current stage of this project is in active development. As such, commits may not be granular, and changes may not always be tracked in fine detail.

## Prerequisites

Use [mise](https://mise.jdx.dev). It will automatically install all the dependencies you need.  
Don't have mise? Check `mise.toml` and install them manually.

## Getting Started

> WORKING IN PROGRESS. NOT WORK YET.

```sh
# Install dependencies, build the project
task init

# Copy .env.example to .env if needed
sh scripts/for-each-package.sh "! [ -f .env.example ] || [ -f .env ] || cp .env.example .env"

# Start Docker containers for example infrastructure
chmod a+x scripts/localstack-setup.sh
docker compose up -d

# Start the backend server
(cd packages/backend/scripts/main && npm start) &
BACKEND_SERVER_PID=$!

# Start the frontend server
(cd packages/frontend/app/main && npm start)

# Cleanup
kill $BACKEND_SERVER_PID
docker compose down
```

## Goals

This repository is for developing/testing experimental packages such as below:

- GraphQL client with type level parser/analyzer, like `gql.tada` but with `@include`/`@skip` support and more
- Strongly typed GraphQL server framework with strict type checking (in contrast to `type-graphql`)
- Command-line arguments parser with type level invalid option detection
- Markdown/MDX alternative document format that supports plugin, section termination, rich structured data, etc.
- TailwindCSS alternative utility class generator without huge initial bundle size, and much more robust dark mode/interactive/group, etc.

### Features

- user login
- post, comment
- user group and role, access control to post
- approval system for share post with other entity

## Development Notes

Currently, all packages are nested three levels deep in the `packages/` directory.  
For example: `packages/a/b/c`.

All `*.js` and `[!_]*.d.ts` files are excluded from Git and VS Code.  
Therefore, if you need to include a `.d.ts` file, make sure it starts with an underscore (e.g., `_declarations.d.ts`).

If type error occurs because of residue `.d.ts` files, use command below:

```sh
sh scripts/for-each-package.sh sh ../../../../scripts/clean-others.sh
```

## Brief Structure

> Note: Actual directory structory may not match yet

- `application` - shared, application-specific packages
  - `api` - API specification between backend/frontend
  - `logic` - common logic between backend/frontend
- `backend` - backend-specific packages
  - `adapters` - adapter implementations
  - `application` - core business logic
  - `data` - data layer
  - `scripts` - runnable scripts, such as start server
  - `util` - backend specific utilities
- `development` - will be used for development only
  - `codegen` - for code generation
  - `scripts` - scripts for development
  - `util` - utilities for `development/*` packages
- `editor` - MDCode: Markdown alternative document format
  - `core` - essential packages to deal with the document
  - `plugins`
  - `react` - renderer and renderer plugins for React
- `frontend` - frontend-specific packages
  - `apps` - Next.js apps
  - `components` - React components
  - `util` - utilities only for frontend
- `graphql` - GraphQL tools like runtime/type-level parser
  - `common` - shared components between server/client
  - `client`
  - `server`
  - `types` - core types, and type level parser/analyzer, etc.
- `util` - basic unopinionated utilities
  - `atomic` - utilities in smallest unit
  - `client` - type checked rest/graphql/jsonrpc/etc. client
  - `types` - type only utilities
- `viuc` - Very Interactive Util Classes: TailwindCSS alternative
  - `main`
  - `type-plugins` - plugins for types such as `bg-[color]`
  - `variant-plugins` - plugins for variants such as `focus:`
