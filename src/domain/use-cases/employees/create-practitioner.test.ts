import "reflect-metadata/lite";
import { describe, expect, test, beforeAll } from "vitest";
import { CreatePractitionerUseCase } from "./create-practitioner";
import { container } from "tsyringe";

describe("CreatePractitionerUseCase", () => {
  
  beforeAll(async () => {});

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