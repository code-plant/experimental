# Test

Development test project.

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

## Development

All packages are nested three levels deep in the `packages/` directory.  
For example: `packages/vendor/project/module`.

All `*.js` and `[!_]*.d.ts` files are excluded from Git and VS Code.  
Therefore, if you need to include a `.d.ts` file, make sure it starts with an underscore (e.g., `_declarations.d.ts`).
