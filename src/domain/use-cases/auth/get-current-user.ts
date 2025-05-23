import { scoped, Lifecycle } from "tsyringe";
import { AuthService } from "../../services/auth.service";
import { UseCase } from "../use-case";

interface GetCurrentUserOutput {
  id: number;
  email: string;
  role?: string;
  isAuthenticated: boolean;
}

@scoped(Lifecycle.ContainerScoped)
export class GetCurrentUserUseCase implements UseCase<void, GetCurrentUserOutput> {
  tableName = null;
  userProvider = {
    getCurrentUserId: async () => {
      if (!this.authService.isAuthenticated()) {
        return null;
      }
      return this.authService.user.id;
    }
  };
  constructor(private authService: AuthService) {}

  async execute(): Promise<GetCurrentUserOutput> {
    const user = this.authService.user;
    
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isAuthenticated: this.authService.isAuthenticated()
    };
  }
}