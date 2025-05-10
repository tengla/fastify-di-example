import { container, inject, injectable } from "tsyringe";
import { UseCase } from "../use-case";
import { type Insertable } from "kysely";
import { type Practitioners } from "@/generated/db.d";
import { PractitionerEntity } from "@/domain/entity/practitioner";
import { AuthService } from "@/domain/services/auth.service";
import { Audited, AuditEvent, type AuditRecord } from "@/packages/decorators/audit.decorator";
import { AuditEntity, type Action } from "@/domain/entity/audit";

const events = new AuditEvent<AuditRecord>();
const audit = container.resolve(AuditEntity);

events.onaudit(async (action, data) => {
  const logged = await audit.log(
    action as Action,
    data.table_name,
    data.record_id as number,
    data.user_id as number,
  );
  console.log(logged);
});

@injectable()
export class CreatePractitionerUseCase implements UseCase<
  Omit<Insertable<Practitioners>, "user_id">,
  ReturnType<PractitionerEntity["createPractitioner"]> extends Promise<infer T> ? T : never
> {
  tableName = "practitioners";
  userProvider = {
    getCurrentUserId: async () => {
      if (!this.authService.isAuthenticated()) {
        return null;
      }
      return this.authService.user.id;
    }
  };

  constructor(
    @inject(PractitionerEntity) private practitionerEntity: PractitionerEntity,
    @inject(AuthService) private authService: AuthService
  ) { }

  @Audited("INSERT", (result) => result.id, events.emit.bind(events))
  async execute(input: Omit<Insertable<Practitioners>, "user_id">) {
    console.log("Creating a practitioner...", input);
    const record = await this.practitionerEntity.createPractitioner(input);
    return record;
  }
}
