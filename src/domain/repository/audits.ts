import { injectable } from "tsyringe";
import { BaseRepository } from "./repository";

@injectable()
export class AuditsRepository extends BaseRepository<"audits"> {
  constructor() {
    super("audits");
  }
}