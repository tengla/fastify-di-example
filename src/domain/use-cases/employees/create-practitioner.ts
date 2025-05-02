import { inject, injectable } from "tsyringe";
import { UseCase } from "../use-case";
import { type Insertable } from "kysely";
import { type Practitioners } from "@/generated/db.d";
import { PractitionerEntity } from "@/domain/entity/practitioner";
import { AuditEntity } from "@/domain/entity/audit";
import { AuthService } from "@/domain/services/auth.service";

@injectable()
export class CreatePractitionerUseCase implements UseCase<
  Omit<Insertable<Practitioners>, "user_id">,
  ReturnType<PractitionerEntity["createPractitioner"]> extends Promise<infer T> ? T : never
> {
  constructor(
    @inject(PractitionerEntity) private practitionerEntity: PractitionerEntity,
    @inject(AuditEntity) private auditEntity: AuditEntity,
    @inject(AuthService) private authService: AuthService
  ) { }
  async execute(input: Omit<Insertable<Practitioners>, "user_id">) {
    console.log("Creating a practitioner...", input);
    const record = await this.practitionerEntity.createPractitioner(input);
    const userId = this.authService.user.id;
    await this.auditEntity.log(
      "INSERT",
      "practitioners",
      record.id!,
      userId
    );
    return record;
  }
}
