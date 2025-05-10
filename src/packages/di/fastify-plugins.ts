import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { getRequestContainer, disposeRequestContainer } from "./container";
import { AuthUserEntity } from "@/domain/entity/auth-user";
import fp from "fastify-plugin";
import type { DependencyContainer } from "tsyringe";

/**
 * Plugin that adds a request-scoped DI container to each request
 */
export const containerPlugin = fp(async (fastify: FastifyInstance) => {
  // Add decorator for the container with proper type
  if (!fastify.hasRequestDecorator('container')) {
    fastify.decorateRequest('container', null as unknown as DependencyContainer);
  }
  
  // Add hook to create container for each request
  fastify.addHook('onRequest', async (request: FastifyRequest) => {
    const requestContainer = getRequestContainer(request);
    request.container = requestContainer;
  });
  
  // Add hook to clean up container after the response
  fastify.addHook('onResponse', async (request: FastifyRequest) => {
    disposeRequestContainer(request);
  });
});

/**
 * Plugin that sets up the authenticated user in the container
 * (requires containerPlugin to be registered first)
 */
export const authUserPlugin = fp(async (fastify: FastifyInstance) => {
  // Add hook to set up the auth user for each request
  fastify.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.container) {
      throw new Error('Request container not found. Make sure containerPlugin is registered.');
    }
    
    // In a real app, this would extract user data from JWT/headers/etc
    // For this example, we'll check for a user object that might be set by other auth plugins
    const userData = request.user || { id: 0, email: '' };
    
    // Only register a real user if we have valid user data
    if (userData.id) {
      const authUser = new AuthUserEntity(userData);
      request.container.registerInstance(AuthUserEntity, authUser);
    } else {
      // Register an empty user for unauthenticated requests
      request.container.registerInstance(AuthUserEntity, new AuthUserEntity());
    }
  });
});
