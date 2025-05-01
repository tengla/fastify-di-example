import type { FastifyInstance } from "fastify";
import { scoped, Lifecycle } from "tsyringe";
import { GetCurrentUserUseCase } from "../../domain/use-cases/auth/get-current-user";
import { AuthService } from "../../domain/services/auth.service";

@scoped(Lifecycle.ContainerScoped)
export class AuthController {
  constructor(
    private getCurrentUserUseCase: GetCurrentUserUseCase,
    private authService: AuthService
  ) {}

  async getCurrentUser() {
    return this.getCurrentUserUseCase.execute();
  }

  async checkAdminAccess() {
    if (!this.authService.hasRole('admin')) {
      throw new Error('Admin access required');
    }
    
    return {
      message: 'Admin access granted',
      user: await this.getCurrentUserUseCase.execute()
    };
  }
}

export function registerAuthRoutes(fastify: FastifyInstance) {
  fastify.get('/api/auth/me', async (request, reply) => {
    const controller = request.container.resolve(AuthController);
    return controller.getCurrentUser();
  });

  fastify.get('/api/auth/admin', async (request, reply) => {
    const controller = request.container.resolve(AuthController);
    
    try {
      return await controller.checkAdminAccess();
    } catch (err: unknown) {
      const error = err as Error;
      return reply.code(403).send({
        error: 'Forbidden',
        message: error.message
      });
    }
  });
}