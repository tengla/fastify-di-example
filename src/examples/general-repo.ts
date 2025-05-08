import "reflect-metadata/lite";
import { db } from "@/packages/database";
import { type Users, type DB, type Practitioners } from "@/generated/db.d";
import type { Insertable } from "kysely";
import { container, inject, injectable } from "tsyringe";

class Entity<Repo> {
  table: keyof DB;
  constructor(table: keyof DB) {
    this.table = table;
  }
  create(item: Insertable<Repo>) {
    return db
      .insertInto(this.table)
      .values(item)
      .returningAll()
      .executeTakeFirstOrThrow();
  }
  delete(id: number) {
    return db.deleteFrom(this.table).where("id", "=", id).execute();
  }
  findById(id: number) {
    return db
      .selectFrom(this.table)
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirstOrThrow();
  }
}

@injectable()
class UserEntity extends Entity<Users> {
  constructor() {
    super("users");
  }
}

@injectable()
class PractitionerEntity extends Entity<Practitioners> {
  constructor() {
    super("practitioners");
  }
  async create(item: Insertable<Omit<Practitioners, "id" | "user_id" | "created_at">>) {
    const user = new UserEntity();
    const userRecord = await user.create({
      email: item.email,
      username: item.name.split(" ").map(n => n.toLowerCase()).join(""),
      password: `password-${item.name}`,
    });
    const insertable = {
      ...item,
      user_id: userRecord.id
    }
    return db
      .insertInto(this.table)
      .values(insertable)
      .returningAll()
      .executeTakeFirstOrThrow();
  }
  async findWithUser(id: number) {
    const record = await db.selectFrom(this.table)
      .select("practitioners.id")
      .select("practitioners.name")
      .select("practitioners.email")
      .select("practitioners.user_id")
      .select("users.username")
      .leftJoin("users", "users.id", "practitioners.user_id")
      .where("practitioners.id", "=", id)
      .executeTakeFirstOrThrow();
    return {
      id: record.id,
      name: record.name,
      email: record.email,
      user: {
        id: record.user_id,
        username: record.username,
      }
    }
  }
}

@injectable()
class GodMode {
  constructor(
    @inject(UserEntity) private user: UserEntity,
    @inject(PractitionerEntity) private practitioner: PractitionerEntity,
  ) { }
  async createPractitioner(item: Insertable<Pick<Practitioners, "name" | "email">>) {
    const user = await this.user.create({
      email: item.email,
      username: item.name,
      password: `password-${item.name}`,
    });
    const insertable = {
      ...item,
      user_id: user.id!
    }
    return this.practitioner.create(insertable);
  }
  async find(id: number) {
    return this.practitioner.findWithUser(id);
  }
}

async function main() {
  const god = container.resolve(GodMode);
  const p = await god.createPractitioner({
    email: "john@example.com",
    name: "John Doe",
  });
  const practitioner = await god.find(p.id!);
  console.log(practitioner);
}

main();
