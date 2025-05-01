import "reflect-metadata";
import { container } from "tsyringe";

// Register any global dependencies here
export function registerDependencies() {
  // Example for global dependencies:
  // container.register(Logger, { useClass: ConsoleLogger });
}

// Export container utilities
export * from "./container";
export * from "./auth-middleware";