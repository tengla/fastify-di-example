import { container, injectable } from "tsyringe";
import { PractitionersRepository } from "../repository/practitioners";
import { UsersRepository } from "../repository/users";
import { type Insertable } from "kysely";
import { type Practitioners } from "@/generated/db.d";

type InsertablePractitioner = Omit<Insertable<Practitioners>, "user_id">;

@injectable()
export class PractitionerEntity {
  async createPractitioner(data: InsertablePractitioner) {
    const practitionerRepo = container.resolve(PractitionersRepository);
    const userRepo = container.resolve(UsersRepository);
    const user = await userRepo.create({
      email: data.email,
      username: data.name,
      password: `password-${data.name}`,
    });
    const practitioner = await practitionerRepo.create({
      ...data,
      user_id: user.id!,
    });
    return practitioner;
  }
}
