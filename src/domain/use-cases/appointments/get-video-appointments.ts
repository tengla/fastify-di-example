import { singleton } from "tsyringe";
import { type UseCase } from "../use-case";

@singleton()
export class GetVideoAppointmentsUseCase implements UseCase<string, string> {
  async execute(input: string) {
    return "GetVideoAppointmentsUseCase: " + input;
  }
}