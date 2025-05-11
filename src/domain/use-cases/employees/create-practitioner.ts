import { inject, injectable } from "tsyringe";
import { UseCase } from "../use-case";
import { type Insertable } from "kysely";
import { type Practitioners } from "@/generated/db.d";
import { PractitionerEntity } from "@/domain/entity/practitioner";
import { AuthService } from "@/domain/services/auth.service";
import { PractitionerService } from "@/domain/services/practitioner.service";
import { UserService } from "@/domain/services/user.service";

@injectable()
export class CreatePractitionerUseCase implements UseCase<
  Omit<Insertable<Practitioners>, "user_id">,
  ReturnType<PractitionerEntity["createPractitioner"]> extends Promise<infer T> ? T : never
> {
  constructor(
    @inject(PractitionerService) private practitionerService: PractitionerService,
    @inject(UserService) private userService: UserService
  ) { }

  async execute(input: Omit<Insertable<Practitioners>, "user_id">) {
    const user = await this.userService.createUser({
      name: input.name,
      email: input.email,
    });
    const practitioner = await this.practitionerService.createPractitioner({
      ...input,
      user_id: user.id!,
    });
    return practitioner;
  }
}
