import "reflect-metadata";
import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import { registerDependencies, requestScopePlugin, authUserPlugin } from "../packages/di";
import { AuthService } from "../domain/services/auth.service";
import { DashboardService } from "../domain/services/dashboard.service";
import fp from "fastify-plugin";
import { CreatePractitionerUseCase } from "@/domain/use-cases/employees/create-practitioner";
import { GetPractitionersUseCase } from "@/domain/use-cases/employees/get-practitioners";
import type { UseCaseError } from "@/domain/use-cases/use-case";

// Register global dependencies
registerDependencies();

// Create Fastify instance
const fastify = Fastify({
  logger: true
});

// Register JWT plugin
fastify.register(fastifyJwt, {
  secret: "supersecretkey" // In production, use environment variables
});

// Register our DI container plugins
fastify.register(requestScopePlugin);

/**
 * JWT auth plugin that verifies the token and extracts user data
 */
const jwtAuthPlugin = fp(async (fastify) => {
  // Add decorator to check if request is authenticated
  // Only decorate if it doesn't already exist
  if (!fastify.hasRequestDecorator('user')) {
    fastify.decorateRequest('user', null);
  }
  
  // Custom JWT extractor from request
  fastify.addHook('onRequest', async (request, reply) => {
    try {
      // Skip authentication for login route
      if (request.routeOptions.url === '/api/login') {
        return;
      }
      
      // Verify and decode JWT
      const token = await request.jwtVerify() as any;
      
      // Set user data from token
      request.user = {
        id: token.id || 0,
        email: token.email || '',
        role: token.role
      };
    } catch (err) {
      // Don't throw here - we'll handle unauthorized access in routes
      // or through the AuthService
      request.user = { id: 0, email: '' };
    }
  });
});

// Register JWT auth plugin before auth user plugin
fastify.register(jwtAuthPlugin);

// Register auth user plugin (after JWT auth)
fastify.register(authUserPlugin);

// Login route - generates a token
fastify.post<{
  Body: {
    email: string;
    password: string;
  };
  Reply: {
    token?: string;
    error?: string;
  };
}>('/api/login', async (request, reply) => {
  const { email, password } = request.body;
  
  if (email === 'admin@example.com' && password === 'password') {
    // Generate token with user data
    const token = fastify.jwt.sign({
      id: 1,
      email: 'admin@example.com',
      role: 'admin'
    }, {
      expiresIn: '1h'
    });
    
    return { token };
  } else if (email === 'user@example.com' && password === 'password') {
    // Regular user token
    const token = fastify.jwt.sign({
      id: 2,
      email: 'user@example.com',
      role: 'user'
    }, {
      expiresIn: '1h'
    });
    
    return { token };
  }
  
  return reply.code(401).send({ error: 'Invalid credentials' });
});

// Protected route requiring authentication
fastify.get('/api/profile', async (request, reply) => {
  const authService = request.container.resolve(AuthService);
  
  if (!authService.isAuthenticated()) {
    return reply.code(401).send({ error: 'Authentication required' });
  }
  
  const user = authService.user;
  
  // Additional profile data that would come from database in real app
  return {
    profile: {
      id: user.id,
      email: user.email,
      role: user.role,
      memberSince: '2023-01-01',
      plan: user.role === 'admin' ? 'enterprise' : 'basic'
    }
  };
});

fastify.post<{
  Body: {
    name: string;
    email: string;
  };
  Reply: {
    practitioner?: any;
    error?: string;
  };
}>('/api/practitioners', async (request, reply) => {
  const authService = request.container.resolve(AuthService);
  if (!authService.isAuthenticated()) {
    return reply.code(401).send({ error: 'Authentication required' });
  }
  const user = authService.user;
  if (user.role !== 'admin') {
    return reply.code(403).send({ error: 'Admin access required' });
  }
  const { name, email } = request.body;
  const useCase = request.container.resolve(CreatePractitionerUseCase);
  const practitioner = await useCase.execute({
    name, 
    email
  });
  return { practitioner };
});

fastify.get('/api/practitioners', async (request, reply) => {
  const useCase = request.container.resolve(GetPractitionersUseCase);
  try {
    const practitioners = await useCase.execute();
    return { practitioners };
  } catch (err: unknown) {
    const error = err as UseCaseError;
    return reply.code(error.httpCode).send({
      error: error.message
    });
  }
});

// Custom use case that needs the authenticated user
fastify.get('/api/dashboard', async (request, reply) => {
  try {
    // Register and resolve the dashboard service
    request.container.register(DashboardService, DashboardService);
    const dashboardService = request.container.resolve(DashboardService);
    
    // Get dashboard data
    const data = await dashboardService.getDashboardData();
    
    return {
      dashboard: data
    };
  } catch (err: unknown) {
    const error = err as Error;
    return reply.code(401).send({
      error: error.message
    });
  }
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