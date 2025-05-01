import "reflect-metadata/lite";
import { describe, test, expect } from "vitest";
import { AuthService } from "./auth.service";
import { container } from "tsyringe";

describe("AuthService", () => {
  test("should be ok", () => {
    const authService1 = container.resolve(AuthService);
    expect(authService1).toBeDefined();
  });
  test("try out some stuff", () => {

    container.clearInstances();

    container.registerInstance(AuthService, new AuthService());
    const authService1 = container.resolve(AuthService);
    console.log("authService1", authService1);

    container.registerInstance(AuthService, new AuthService());
    container.clearInstances();
    const authService2 = container.resolve(AuthService);
    console.log("authService1", authService2);
  });
});