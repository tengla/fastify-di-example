import { db } from "@/packages/database";
import { type Users } from "@/generated/db.d";
import { type CRUDRepository } from "./icrud";
import { DeleteResult, type Insertable, type Updateable } from "kysely";
import { injectable } from "tsyringe";

@injectable()
export class UsersRepository implements CRUDRepository<Users> {
  async create(item: Insertable<Users>) {
    return db
      .insertInto("users")
      .values(item)
      .returningAll()
      .executeTakeFirstOrThrow();
  }
  async read(id: number) {
    const result = await db
      .selectFrom("users")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    if (!result) {
      throw new Error(`Practitioner with id ${id} not found`);
    }
    return result;
  }
  async update(id: number, item: Updateable<Users>) {
    const updated = await db
      .updateTable("users")
      .set(item)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
    if (!updated) {
      return null;
    }
    return updated;
  }
  async list()  {
    return Promise.resolve([]);
  }
  delete(id: number): Promise<DeleteResult[]> {
    return db.deleteFrom("users").where("id", "=", id).execute();
  }
  async deleteAll(): Promise<boolean> {
    await db.deleteFrom("users").execute();
    return true;
  }
  findBy(field: keyof Users, value: any): Promise<Users | null> {
    throw new Error("Method not implemented.");
  }
  findAllBy(field: keyof Users, value: any): Promise<Users[]> {
    throw new Error("Method not implemented.");
  }
  count(): Promise<number> {
    throw new Error("Method not implemented.");
  }
  exists(id: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}