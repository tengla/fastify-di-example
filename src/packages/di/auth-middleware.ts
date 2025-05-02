import { getRequestContainer, disposeRequestContainer } from "./container";
import { AuthUserEntity } from "../../domain/entity/auth-user";
import fp from "fastify-plugin";

/**
 * Plugin that adds a request-scoped DI container to each request
 */
export const requestScopePlugin = fp(async (fastify) => {
  // Add decorator for the container
  fastify.decorateRequest('container', null);
  
  // Add hook to create container for each request
  fastify.addHook('onRequest', async (request, reply) => {
    const requestContainer = getRequestContainer(request);
    request.container = requestContainer;
  });
  
  // Add hook to clean up container after the response
  fastify.addHook('onResponse', async (request, reply) => {
    disposeRequestContainer(request);
  });
});

/**
 * Plugin that extracts user data from auth token/session and 
 * creates an AuthUserEntity in the request-scoped container
 */
export const authUserPlugin = fp(async (fastify) => {
  // Add hook to set up the auth user for each request
  fastify.addHook('preHandler', async (request, reply) => {
    if (!request.container) {
      throw new Error('Request container not found. Make sure requestScopePlugin is registered first.');
    }
    
    // In a real application, you would extract user data from a JWT token, session, etc.
    // For this example, we'll just use mock data or data from the request
    const userData = request.user || { id: 0, email: '' };
    
    // Register the AuthUserEntity instance in the request-scoped container
    if (userData.id) {
      const authUser = new AuthUserEntity(userData);
      request.container.registerInstance(AuthUserEntity, authUser);
    } else {
      // Register an empty user for unauthenticated requests
      request.container.registerInstance(AuthUserEntity, new AuthUserEntity());
    }
  });
});
