
import { inject, injectable } from "tsyringe";
import type { UseCase } from "../use-case";
import { AuthService } from "@/domain/services/auth.service";
import { UseCaseError } from "@/domain/use-cases/use-case";
import { Logger, LoggerService } from "@/domain/services/logger.service";

@injectable()
export class WelcomeUseCase implements UseCase<
  string, string
> {
  tableName = null;
  userProvider = {
    getCurrentUserId: async () => {
      if (!this.authService.isAuthenticated()) {
        return null;
      }
      return this.authService.user.id;
    }
  }
  constructor(
    @inject(AuthService) private authService: AuthService,
    @inject(LoggerService) private logger: typeof Logger,
  ) { }
  async execute() {
    const logger = this.logger.child({
      useCase: this.constructor.name,
    });
    if (!this.authService.isAuthenticated()) {
      logger.error("Authentication required");
      throw new UseCaseError("Authentication required", 401);
    }
    if (!this.authService.isAuthenticatedWithRole("admin")) {
      logger.error("Admin access required");
      throw new UseCaseError("Admin access required", 403);
    }
    const name = this.authService.user.name || "Guest";
    return "Welcome, " + name + "!";
  }
}
