# Project coding standards

This file provides guidance to Co-Pilot when working with code in this repository.

## Build/Test/Lint Commands

- Run project: `bun run src/index.ts`
- Run example files: `npx tsx src/examples/{filename}.ts` (Note: use tsx instead of bun for examples as bun has issues with better-sqlite3)
- Run all tests: `npx vitest run src/` or `bun test src/`
- Run a single test: `npx vitest run src/path/to/test.ts` or `bun test src/path/to/test.ts`
- Run tests in watch mode: `npx vitest src/` or `bun test src/ --watch`
- Run tests with coverage: `npx vitest run --coverage src/`
- Build & migrate database: `task migrate`
- Generate DB types: `task codegen`

## Code Style Guidelines

- **Imports**: Use path aliases (`@/`) for internal imports; sort imports (third-party then internal)
- **Types**: Use strict TypeScript typing; prefer explicit return types for functions
- **Naming**: Use PascalCase for classes, camelCase for variables/methods, and UPPER_CASE for constants
- **Architecture**: Follow Domain-Driven Design principles with entity/repository/use-case pattern
- **DI**: Use tsyringe for dependency injection with `@injectable()` and `@singleton()` decorators
- **Error handling**: Use explicit error throwing with descriptive messages
- **Database**: Use Kysely for type-safe SQL queries with generated types from schema
- **Schema**: Database schema defined in schema.hcl using Atlas format
- **Testing**: Use Vitest for unit tests with descriptive test names in BDD style
- **Path Aliases**: Import project files using `@/` prefix (configured in both tsconfig.json and vitest.config.ts)
- **Runtime**: Uses Bun as JavaScript/TypeScript runtime environment
- **Authentication**: JWT-based auth using @fastify/jwt package

## Known Issues and Workarounds

- **Fastify JWT Types**: When using @fastify/jwt and request.jwtVerify(), you may need to use `as any` or provide explicit type parameters to avoid TypeScript errors with `id` property not existing on `VerifyPayloadType`. Use `AuthUserProps` interface from auth-user.ts as the type parameter.

- **Reflect Metadata**: Always import "reflect-metadata" at the top of files using tsyringe decorators to ensure proper dependency injection.

- **Fastify Decorators**: When creating plugins that decorate the request object, always check if a decorator already exists before adding it to avoid runtime errors:
  ```typescript
  if (!fastify.hasRequestDecorator('user')) {
    fastify.decorateRequest('user', null);
  }
  ```

- **Better-sqlite3**: When running examples that use better-sqlite3, use `npx tsx` instead of `bun run` due to compatibility issues.

## Example Files

The repository contains several example files that demonstrate common patterns:

- **jwt-auth-example.ts**: Demonstrates JWT authentication with Fastify, including:
  - Issuing JWT tokens during login
  - Verifying tokens on protected routes
  - Role-based authorization
  - Using AuthService with dependency injection
  - Handling authenticated/unauthenticated users

- **request-scoped-di.ts**: Demonstrates request-scoped dependency injection with tsyringe