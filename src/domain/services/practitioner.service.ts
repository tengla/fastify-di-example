import { inject, injectable } from "tsyringe";
import { AuthService } from "./auth.service";
import { PractitionersRepository } from "@/domain/repository/practitioners";
import { BaseService } from "./base.service";
import { AuditEntity } from "@/domain/entity/audit";
import { Audit } from "@/packages/decorators/audit.decorator";
import { Logger, LoggerService } from "./logger.service";

@injectable()
export class PractitionerService extends BaseService {
  tableName = "practitioners";
  constructor(
    @inject(AuthService) private authService: AuthService,
    @inject(PractitionersRepository) private practitionersRepository: PractitionersRepository,
    @inject(AuditEntity) audit: AuditEntity,
    @inject(LoggerService) logger: typeof Logger,
  ) { super(audit,logger); }

  @Audit(
    "INSERT",
    <T extends { id: number }>(result: T) => result.id
  )
  async createPractitioner({ name, email, user_id }: { name: string, email: string, user_id: number }) {
    const practitioner = await this.practitionersRepository
      .create({
        name, email, user_id
      });
    return practitioner;
  }
  protected getCurrentUserId(): number | null {
    // Get user context from current request scope
    const user = this.authService.user
    if (user) {
      return user.id;
    }
    return null;
  }
}
