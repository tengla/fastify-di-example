import { inject, injectable } from "tsyringe";
import { Audit } from "@/packages/decorators/audit.decorator";
import { UsersRepository } from "@/domain/repository/users";
import { AuditEntity } from "@/domain/entity/audit";
import { BaseService } from "./base.service";
import { AuthService } from "./auth.service";
import { Logger, LoggerService } from "./logger.service";

@injectable()
export class UserService extends BaseService {
  
  tableName = "users";

  constructor(
    @inject(AuthService) private authService: AuthService,
    @inject(UsersRepository) private usersRepository: UsersRepository,
    @inject(AuditEntity) audit: AuditEntity,
    @inject(LoggerService) logger: typeof Logger,
  ) {
    super(audit, logger);
  }

  @Audit(
    "INSERT",
    <T extends { id: number }>(result: T) => result.id
  )
  async createUser({ name, email }: { name: string, email: string }) {
    const user = await this.usersRepository.create({
      username: name.split(" ").map(n => n.toLocaleLowerCase()).join("_"),
      email,
      password: "123456",
    });
    return user
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
