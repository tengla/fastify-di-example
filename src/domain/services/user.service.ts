import { container, inject, injectable } from "tsyringe";
import { AuthService } from "./auth.service";
import { Audited, AuditEvent, AuditProvider, type AuditRecord, type UserProvider } from "@/packages/decorators/audit.decorator";
import { UsersRepository } from "../repository/users";
import { AuditEntity, type Action } from "../entity/audit";
import { LoggerService, Logger } from "@/domain/services/logger.service";

const events = new AuditEvent<AuditRecord>();
const audit = container.resolve(AuditEntity);
const logger = container.resolve<typeof Logger>(LoggerService);

events.onaudit(async (action, data) => {
  const a = await audit.log(
    action as Action,
    data.table_name,
    data.record_id as number,
    data.user_id as number,
  );
  logger.debug(a);
});

@injectable()
export class UserService implements AuditProvider {
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
    @inject(UsersRepository) private usersRepository: UsersRepository,
  ) { }
  @Audited("INSERT", (result) => result.id, async (action, data) => {
    events.emit(action, data);
  })
  async createPractitioner({ name, email }: { name: string, email: string }) {
    const user = await this.usersRepository.create({
      username: name.split(" ").map(n => n.toLocaleLowerCase()).join("_"),
      email,
      password: "123456",
    });
    return user
  }
}
