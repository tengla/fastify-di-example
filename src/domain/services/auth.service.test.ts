import "reflect-metadata/lite";
import { describe, test, expect } from "vitest";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
  test("should be ok", () => {
    expect(AuthService).toBeDefined();
  });
});