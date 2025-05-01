import "reflect-metadata";
import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import { scoped, Lifecycle } from "tsyringe";
import { registerDependencies, requestScopePlugin, authUserPlugin } from "../packages/di";
import { AuthService } from "../domain/services/auth.service";
import fp from "fastify-plugin";

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
fastify.post('/api/login', async (request, reply) => {
  const { email, password } = request.body as any;
  
  // In real app, verify credentials against database
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

// Role-based route (admin only)
fastify.get('/api/admin/users', async (request, reply) => {
  const authService = request.container.resolve(AuthService);
  
  if (!authService.hasRole('admin')) {
    return reply.code(403).send({ error: 'Admin access required' });
  }
  
  // Mock user list (would come from database in real app)
  return {
    users: [
      { id: 1, email: 'admin@example.com', role: 'admin' },
      { id: 2, email: 'user@example.com', role: 'user' },
      { id: 3, email: 'user2@example.com', role: 'user' }
    ]
  };
});

// Custom use case that needs the authenticated user
fastify.get('/api/dashboard', async (request, reply) => {
  // Create a dashboard service that uses the AuthService
  @scoped(Lifecycle.ContainerScoped)
  class DashboardService {
    constructor(private authService: AuthService) {}
    
    async getDashboardData() {
      if (!this.authService.isAuthenticated()) {
        throw new Error('Authentication required');
      }
      
      const user = this.authService.user;
      
      // Different dashboard data based on user role
      if (this.authService.hasRole('admin')) {
        return {
          metrics: {
            totalUsers: 45,
            activeUsers: 32,
            revenue: '$12,450'
          },
          recentActivities: [
            { type: 'user_signup', user: 'john@example.com', time: '2h ago' },
            { type: 'payment_received', amount: '$199', time: '3h ago' }
          ]
        };
      } else {
        return {
          metrics: {
            tasks: 12,
            completed: 8,
            pending: 4
          },
          recentActivities: [
            { type: 'task_completed', task: 'Upload documents', time: '2h ago' },
            { type: 'comment_added', comment: 'Great job!', time: '3h ago' }
          ]
        };
      }
    }
  }
  
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