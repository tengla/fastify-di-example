import { inject, injectable } from "tsyringe";
import { UseCase } from "../use-case";
import { type Insertable } from "kysely";
import { type Practitioners } from "@/generated/db.d";
import { PractitionerEntity } from "@/domain/entity/practitioner";
import { PractitionerService } from "@/domain/services/practitioner.service";
import { UserService } from "@/domain/services/user.service";
import { Logger, LoggerService } from "@/domain/services/logger.service";

@injectable()
export class CreatePractitionerUseCase implements UseCase<
  Omit<Insertable<Practitioners>, "user_id">,
  ReturnType<PractitionerEntity["createPractitioner"]> extends Promise<infer T> ? T : never
> {
  constructor(
    @inject(PractitionerService) private practitionerService: PractitionerService,
    @inject(UserService) private userService: UserService,
    @inject(LoggerService) private logger: typeof Logger
  ) { }

  async execute(input: Omit<Insertable<Practitioners>, "user_id">) {
    performance.mark("create-practitioner-start");
    const user = await this.userService.createUser({
      name: input.name,
      email: input.email,
    });
    const practitioner = await this.practitionerService.createPractitioner({
      ...input,
      user_id: user.id!,
    });
    performance.mark("create-practitioner-end");
    const measure = performance.measure(
      "create-practitioner",
      "create-practitioner-start",
      "create-practitioner-end"
    );
    this.logger.info(
      `Create practitioner use case executed in ${measure.duration}ms`
    );
    return practitioner;
  }
}
