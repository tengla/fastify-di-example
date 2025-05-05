import { db } from "@/packages/database";
import { type Audits } from "@/generated/db.d";
import { type CRUDRepository } from "./icrud";
import { DeleteResult, type Insertable, type Updateable } from "kysely";
import { injectable } from "tsyringe";

@injectable()
export class AuditsRepository implements CRUDRepository<Audits> {
  async create(item: Insertable<Audits>) {
    return db
      .insertInto("audits")
      .values(item)
      .returningAll()
      .executeTakeFirstOrThrow();
  }
  async read(id: number) {
    const result = await db
      .selectFrom("audits")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    if (!result) {
      throw new Error(`Practitioner with id ${id} not found`);
    }
    return result;
  }
  async update(id: number, item: Updateable<Audits>) {
    const updated = await db
      .updateTable("audits")
      .set(item)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
    if (!updated) {
      return null;
    }
    return updated;
  }
  async list() {
    return Promise.resolve([]);
  }
  delete(id: number): Promise<DeleteResult[]> {
    return db.deleteFrom("audits").where("id", "=", id).execute();
  }
  findBy(field: keyof Audits, value: any) {
    return db.selectFrom("audits")
      .selectAll()
      .where(field, "=", value)
      .executeTakeFirstOrThrow();
  }
  findAllBy(field: keyof Audits, value: any) {
    return db
      .selectFrom("audits")
      .selectAll()
      .where(field, "=", value)
      .execute();
  }
  async count() {
    const result = await db
      .selectFrom("audits")
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