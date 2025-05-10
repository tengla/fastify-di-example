import { inject, injectable } from "tsyringe";
import { AuthService } from "./auth.service";
import { AuditProvider, type UserProvider } from "@/packages/decorators/audit.decorator";
import { PractitionersRepository } from "@/domain/repository/practitioners";

@injectable()
export class PractitionerService implements AuditProvider {
  tableName = "practitioners";
  userProvider: UserProvider = {
    getCurrentUserId: async () => {
      if (!this.authService.isAuthenticated()) {
        return null;
      }
      return this.authService.user.id;
    }
  }
  constructor(
    @inject(AuthService) private authService: AuthService,
    @inject(PractitionersRepository) private practitionersRepository: PractitionersRepository,
  ) { }
  
  async createPractitioner({ name, email, user_id }: { name: string, email: string, user_id: number }) {
    const practitioner = await this.practitionersRepository.create({
      name,
      email,
      user_id,
    });
    return practitioner;
  }
}
