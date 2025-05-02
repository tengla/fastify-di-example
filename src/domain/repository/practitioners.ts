import { db } from "@/packages/database";
import { type Practitioners } from "@/generated/db.d";
import { type CRUDRepository } from "./icrud";
import { DeleteResult, type Insertable, type Updateable } from "kysely";
import { injectable } from "tsyringe";

@injectable()
export class PractitionersRepository implements CRUDRepository<Practitioners> {
  async create(item: Insertable<Practitioners>) {
    return db
      .insertInto("practitioners")
      .values(item)
      .returningAll()
      .executeTakeFirstOrThrow();
  }
  async read(id: number) {
    const result = await db
      .selectFrom("practitioners")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    if (!result) {
      throw new Error(`Practitioner with id ${id} not found`);
    }
    return result;
  }
  async update(id: number, item: Updateable<Practitioners>) {
    const updated = await db
      .updateTable("practitioners")
      .set(item)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
    if (!updated) {
      return null;
    }
    return updated;
  }
  list() {
    return db
      .selectFrom("practitioners")
      .selectAll()
      .execute()
  }
  delete(id: number): Promise<DeleteResult[]> {
    return db.deleteFrom("practitioners").where("id", "=", id).execute();
  }
  async deleteAll(): Promise<boolean> {
    await db.deleteFrom("practitioners").execute();
    return true;
  }
  findBy(field: keyof Practitioners, value: any) {
    return db.selectFrom("practitioners")
      .selectAll()
      .where(field, "=", value)
      .executeTakeFirstOrThrow();
  }
  findAllBy(field: keyof Practitioners, value: any) {
    return db
      .selectFrom("practitioners")
      .selectAll()
      .where(field, "=", value)
      .execute();
  }
  async count(): Promise<{ count: string | number | bigint }> {
    const result = await db
      .selectFrom("practitioners")
      .select(db.fn.count("id").as("count"))
      .executeTakeFirst();
    if (!result) {
      throw new Error("No result found");
    }
    return result;
  }
  exists(id: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}