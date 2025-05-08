import { injectable } from "tsyringe";
import { BaseRepository } from "./repository";

@injectable()
export class PractitionersRepository extends BaseRepository<"practitioners"> {
  constructor() {
    super("practitioners");
  }
}