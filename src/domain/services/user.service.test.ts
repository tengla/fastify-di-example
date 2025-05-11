import "reflect-metadata/lite";
import { container } from "tsyringe";
import { describe, expect, it, vitest } from "vitest";
import { UserService } from "./user.service";
import { AuthUserEntity } from "../entity/auth-user";
import { AuthService } from "./auth.service";
import { AuditEntity } from "../entity/audit";

describe("UserService", () => {
  it("should create a user", async () => {
    container.registerInstance(AuthService,
      new AuthService(
        new AuthUserEntity({
          id: 1,
          email: "john@example.com",
          name: "John Doe",
          role: "admin",
        })
      )
    );
    const mockFn = vitest.fn().mockResolvedValue('Audit Entry');
    container.register(AuditEntity, {
      useValue: {
        log: mockFn,
      } as any,
    });
    const userService = container.resolve(UserService);
    await userService.createUser({
      name: "Jennie Doe",
      email: "jennie@example.com",
    });
    expect(mockFn).toHaveBeenCalledWith(
      "INSERT",
      "UserService",
      expect.any(Number),
      1
    );
  });
});