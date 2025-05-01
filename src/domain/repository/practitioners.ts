import { db } from "../../packages/database";
import { type Practitioners } from "../../generated/db.d";
import { type CRUDRepository } from "./icrud";
import { type Insertable, type Updateable } from "kysely";
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
  async list()  {
    return Promise.resolve([]);
  }
  delete(id: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  findBy(field: keyof Practitioners, value: any): Promise<Practitioners | null> {
    throw new Error("Method not implemented.");
  }
  findAllBy(field: keyof Practitioners, value: any): Promise<Practitioners[]> {
    throw new Error("Method not implemented.");
  }
  count(): Promise<number> {
    throw new Error("Method not implemented.");
  }
  exists(id: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}