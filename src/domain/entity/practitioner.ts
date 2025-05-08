import { inject, injectable } from "tsyringe";
import { PractitionersRepository } from "../repository/practitioners";
import { UsersRepository } from "../repository/users";
import { type Insertable } from "kysely";
import { type Practitioners } from "@/generated/db.d";

type InsertablePractitioner = Omit<Insertable<Practitioners>, "user_id" | "id" | "created_at">;

@injectable()
export class PractitionerEntity {
  constructor(
    @inject(PractitionersRepository) private practitionersRepository: PractitionersRepository,
    @inject(UsersRepository) private usersRepository: UsersRepository
  ) {}
  async createPractitioner(data: InsertablePractitioner) {
    const user = await this.usersRepository.create({
      email: data.email,
      username: data.name,
      password: `password-${data.name}`,
    });
    const practitioner = await this.practitionersRepository.create({
      ...data,
      user_id: user.id!,
    });
    return practitioner;
  }
  async getPractitioners() {
    const practitioners = await this.practitionersRepository.list();
    return practitioners;
  }
}
