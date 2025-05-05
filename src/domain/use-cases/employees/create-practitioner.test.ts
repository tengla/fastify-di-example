import "reflect-metadata/lite";
import { describe, expect, test, beforeAll, vitest } from "vitest";
import { CreatePractitionerUseCase } from "./create-practitioner";
import { container } from "tsyringe";
import { PractitionerEntity } from "@/domain/entity/practitioner";
import { AuditEntity } from "@/domain/entity/audit";
import { AuthUserEntity } from "@/domain/entity/auth-user";

describe("CreatePractitionerUseCase", () => {
  
  beforeAll(async () => {
    // Register dependencies required for tests
    container.registerInstance(AuthUserEntity, new AuthUserEntity({ id: 1, email: "test@example.com" }));
    
    // Mock implementations for dependencies
    container.register(PractitionerEntity, {
      useValue: {
        createPractitioner: vitest.fn().mockResolvedValue({
          id: 1,
          user_id: 1,
          name: "John Doe",
          email: "john@example.com",
          created_at: new Date().toISOString(),
        }),
      } as any,
    });
    
    container.register(AuditEntity, {
      useValue: {
        log: async (...args: any[]) => {},
      } as any,
    });
  });

  test("should create a practitioner", async () => {
    const useCase = container.resolve(CreatePractitionerUseCase);
    const record = await useCase.execute({
      name: "John Doe",
      email: "john@example.com",
    });
    expect(record).toEqual({
      created_at: expect.any(String),
      email: "john@example.com",
      id: expect.any(Number),
      user_id: expect.any(Number),
      name: "John Doe",
    });
  });
});