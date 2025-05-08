import { injectable } from "tsyringe";
import { BaseRepository } from "./repository";

@injectable()
export class UsersRepository extends BaseRepository<"users"> {
  constructor() {
    super("users");
  }
}