import { db } from "@/packages/database";
import { type Patients } from "@/generated/db.d";
import { type CRUDRepository } from "./icrud";
import { DeleteResult, type Insertable, type Updateable } from "kysely";
import { injectable } from "tsyringe";

@injectable()
export class PatientsRepository implements CRUDRepository<Patients> {
  tableName: "patients" = "patients";
  async create(item: Insertable<Patients>) {
    return db
      .insertInto(this.tableName)
      .values(item)
      .returningAll()
      .executeTakeFirstOrThrow();
  }
  async read(id: number) {
    const result = await db
      .selectFrom(this.tableName)
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    if (!result) {
      throw new Error(`Practitioner with id ${id} not found`);
    }
    return result;
  }
  async update(id: number, item: Updateable<Patients>) {
    const updated = await db
      .updateTable(this.tableName)
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
    return db.deleteFrom(this.tableName).where("id", "=", id).execute();
  }
  async deleteAll(): Promise<boolean> {
    await db.deleteFrom("patients").execute();
    return true;
  }
  findBy(field: keyof Patients, value: any) {
    return db.selectFrom("patients")
      .selectAll()
      .where(field, "=", value)
      .executeTakeFirstOrThrow();
  }
  findAllBy(field: keyof Patients, value: any) {
    return db
      .selectFrom("practitioners")
      .selectAll()
      .where(field, "=", value)
      .execute();
  }
  async count() {
    const result = await db
      .selectFrom("patients")
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