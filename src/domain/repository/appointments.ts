import { db } from "@/packages/database";
import { type Appointments } from "@/generated/db";
import { type CRUDRepository } from "./icrud";
import { type Insertable, type Updateable } from "kysely";

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
  async list()  {
    return Promise.resolve([]);
  }
  delete(id: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  findBy(field: keyof Appointments, value: any): Promise<Appointments | null> {
    throw new Error("Method not implemented.");
  }
  findAllBy(field: keyof Appointments, value: any): Promise<Appointments[]> {
    throw new Error("Method not implemented.");
  }
  count(): Promise<number> {
    throw new Error("Method not implemented.");
  }
  exists(id: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}