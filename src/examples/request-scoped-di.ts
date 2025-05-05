import Fastify from "fastify";
import { registerDependencies, containerPlugin, authUserPlugin } from "../packages/di";
import { AuthService } from "../domain/services/auth.service";

// Register global dependencies
registerDependencies();

// Create Fastify instance
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

// Example protected route using the AuthService
fastify.get('/api/protected', async (request, reply) => {
  const authService = request.container.resolve(AuthService);
  
  if (!authService.isAuthenticated()) {
    return reply.code(401).send({ message: "Unauthorized" });
  }
  
  // Access the authenticated user from the service
  const user = authService.user;
  
  return {
    message: "This is a protected route",
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  };
});

// Example role-based route
fastify.get('/api/admin', async (request, reply) => {
  const authService = request.container.resolve(AuthService);
  
  if (!authService.hasRole("admin")) {
    return reply.code(403).send({ 
      message: "Forbidden: Admin access required" 
    });
  }
  
  return {
    message: "Admin dashboard data",
    user: {
      id: authService.user.id,
      email: authService.user.email,
      role: authService.user.role
    }
  };
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log('Server listening on port 3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();