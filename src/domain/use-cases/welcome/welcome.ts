
import { inject, injectable } from "tsyringe";
import type { UseCase } from "../use-case";
import { AuthService } from "@/domain/services/auth.service";
import { UseCaseError } from "@/domain/use-cases/use-case";

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
  ) { }
  async execute() {
    if (!this.authService.isAuthenticated()) {
      throw new UseCaseError("Authentication required", 401);
    }
    if (!this.authService.isAuthenticatedWithRole("admin")) {
      throw new UseCaseError("Admin access required", 403);
    }
    const name = this.authService.user.name || "Guest";
    return "Welcome, " + name + "!";
  }
}
