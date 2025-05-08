import { injectable } from "tsyringe";
import { BaseRepository } from "./repository";

@injectable()
export class PatientsRepository extends BaseRepository<"patients"> {
  constructor() {
    super("patients");
  }
}