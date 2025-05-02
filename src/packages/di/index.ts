import "reflect-metadata";
import { container } from "tsyringe";
import { CreatePractitionerUseCase } from "@/domain/use-cases/employees/create-practitioner";
import { GetPractitionersUseCase } from "@/domain/use-cases/employees/get-practitioners";

// Register any global dependencies here
export function registerDependencies() {
  container.register(CreatePractitionerUseCase, CreatePractitionerUseCase);
  container.register(GetPractitionersUseCase, GetPractitionersUseCase);
}

// Export container utilities
export * from "./container";
export * from "./auth-middleware";