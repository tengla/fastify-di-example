import { db } from "@/packages/database";
import { injectable } from "tsyringe";
import { BaseRepository } from "./repository";

@injectable()
export class AppointmentsRepository extends BaseRepository<"appointments"> {
  constructor() {
    super("appointments");
  }
  
  // Override list method to add sorting by created_at
  override async list() {
    return db
      .selectFrom(this.tableName)
      .selectAll()
      .orderBy("created_at", "desc")
      .execute();
  }
}