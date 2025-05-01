import { db } from "@/packages/database";
import { type Users } from "@/generated/db";
import { type CRUDRepository } from "./icrud";
import { type Insertable, type Updateable } from "kysely";

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
  delete(id: number): Promise<boolean> {
    throw new Error("Method not implemented.");
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