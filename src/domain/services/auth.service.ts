import { scoped, inject, Lifecycle } from "tsyringe";
import { AuthUserEntity } from "../entity/auth-user";

@scoped(Lifecycle.ContainerScoped)
export class AuthService {
  constructor(
    @inject(AuthUserEntity) private authUser: AuthUserEntity
  ) {}
  
  /**
   * Get the authenticated user for the current request
   */
  get user(): AuthUserEntity {
    return this.authUser;
  }

  /**
   * Check if the user has the specified role
   */
  hasRole(role: string): boolean {
    return this.authUser.hasRole(role);
  }
  
  /**
   * Check if the current user is authenticated
   */
  isAuthenticated(): boolean {
    return this.authUser.isAuthenticated();
  }
  isAuthenticatedWithRole(role: string): boolean {
    return this.authUser.isAuthenticated() && this.authUser.hasRole(role);
  }
}