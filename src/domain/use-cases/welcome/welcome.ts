
import { inject, injectable } from "tsyringe";
import type { UseCase } from "../use-case";
import { AuthService } from "@/domain/services/auth.service";
import { UseCaseError } from "@/domain/use-cases/use-case";

@injectable()
export class WelcomeUseCase implements UseCase<
  string, string
> {
  constructor(
    @inject(AuthService) private authService: AuthService,
  ) { }
  async execute(name: string) {
    if(!this.authService.isAuthenticated()) {
      throw new UseCaseError('Authentication required', 401);
    }
    if (!this.authService.hasRole("user")) {
      throw new UseCaseError('User access required', 403);
    }
    return "Welcome, " + name + "!";
  }
}
