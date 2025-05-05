import "reflect-metadata";
import Fastify from "fastify";
import { registerDependencies, containerPlugin, authUserPlugin } from "./packages/di";
import { registerAuthRoutes } from "./api/controllers/auth-controller";

// Register global dependencies
registerDependencies();

// Create fastify instance
const fastify = Fastify({
  logger: true
});

// Register our DI container plugins
fastify.register(containerPlugin);

// Mock auth plugin to simulate authenticated users
// In a real app, this would be a JWT or session-based auth plugin
fastify.decorateRequest('user', null);
fastify.addHook('onRequest', async (request, reply) => {
  // Simulate an authenticated user
  request.user = {
    id: 123,
    email: "user@example.com",
    role: "admin"
  };
});

// Register our auth user plugin (after the mock auth)
fastify.register(authUserPlugin);

// Register route controllers
registerAuthRoutes(fastify);

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();