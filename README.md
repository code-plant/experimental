# Test

Development test project.

> WORKING IN PROGRESS. NOT WORK YET.

The current stage of this project is in active development. As such, commits may not be granular, and changes may not always be tracked in fine detail.

## Prerequisites

Use [mise](https://mise.jdx.dev). It will automatically install all the dependencies you need.  
Don't have mise? Check `mise.toml` and install them manually.

## Getting Started

```sh
# Install dependencies, build the project, and run tests
task all

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

## Features

- user login
- post, comment
- user group and role, access control to post
- approval system for share post with other entity

## Development

All packages are nested three levels deep in the `packages/` directory.  
For example: `packages/vendor/project/module`.

All `*.js` and `[!_]*.d.ts` files are excluded from Git and VS Code.  
Therefore, if you need to include a `.d.ts` file, make sure it starts with an underscore (e.g., `_declarations.d.ts`).

If type error occurs because of residue `.d.ts` files, use command below:

```sh
sh scripts/for-each-package.sh sh ../../../../scripts/clean-others.sh
```

## Brief Structure

- `backend` - backend-specific packages
  - `adapters` - adapter implementations
  - `application` - core business logic
  - `data` - data layer
  - `scripts` - runnable scripts, such as start server
- `common` - can be used both in backend, frontend, or even development
  - `api` - API types
  - `application` - shared business logic
  - `util` - utilities
- `development` - will be used for development only
  - `codegen` - for code generation
  - `guc` - Generated Utility Classes - tailwindcss alternative
  - `util` - utilities only for development
- `frontend` - frontend-specific packages
  - `apps` - Next.js apps
  - `components` - React components
  - `util` - utilities only for frontend
