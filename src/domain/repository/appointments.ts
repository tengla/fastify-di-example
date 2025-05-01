import { db } from "@/packages/database";
import { type Appointments } from "@/generated/db";
import { type CRUDRepository } from "./icrud";
import { DeleteResult, type Insertable, type Updateable } from "kysely";

export class AppointmentsRepository implements CRUDRepository<Appointments> {
  async create(item: Insertable<Appointments>) {
    return db
      .insertInto("appointments")
      .values(item)
      .returningAll()
      .executeTakeFirstOrThrow();
  }
  async read(id: number) {
    const result = await db
      .selectFrom("appointments")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    if (!result) {
      throw new Error(`Appointment with id ${id} not found`);
    }
    return result;
  }
  async update(id: number, item: Updateable<Appointments>) {
    const updated = await db
      .updateTable("appointments")
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
      .selectFrom("appointments")
      .selectAll()
      .orderBy("created_at", "desc")
      .execute();
  }
  delete(id: number): Promise<DeleteResult[]> {
    return db.deleteFrom("appointments").where("id", "=", id).execute();
  }
  findBy(field: keyof Appointments, value: any) {
    return db.selectFrom("appointments")
      .selectAll()
      .where(field, "=", value)
      .executeTakeFirstOrThrow();
  }
  findAllBy(field: keyof Appointments, value: any) {
    return db
      .selectFrom("appointments")
      .selectAll()
      .where(field, "=", value)
      .execute();
  }
  count() {
    return db
      .selectFrom("appointments")
      .select(db.fn.count("id").as("count"))
      .executeTakeFirstOrThrow()
  }
  async exists(id: number): Promise<boolean> {
    const result = await db
      .selectFrom("appointments")
      .select(db.fn.count("id").as("count"))
      .where("id", "=", id)
      .executeTakeFirst();
    if (!result) {
      return false;
    }
    const count = result.count as number;
    return count > 0;
  }
}