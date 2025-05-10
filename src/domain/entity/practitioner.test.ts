import "reflect-metadata";
import { describe, expect, it } from "vitest";
import { container } from "tsyringe";
import { PractitionerEntity } from "./practitioner";
import { PractitionersRepository } from "@/domain/repository/practitioners";

describe("PractitionerEntity", () => {
  it("should create a practitioner with valid data", async () => {
    const repo = container.resolve(PractitionersRepository);
    const entity = container.resolve(PractitionerEntity);
    const p = await entity.createPractitioner({
      name: "John Doe",
      email: "john@example.com"
    });
    expect(p.name).toBe("John Doe");
    await repo.deleteAll();
  });
});