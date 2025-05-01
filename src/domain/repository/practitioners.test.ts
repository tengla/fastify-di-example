import "reflect-metadata/lite";
import { describe, expect, test } from "vitest";
import { PractitionersRepository } from "./practitioners";
import { container } from "tsyringe";

describe("PractitionersRepository", () => {
  test("practitioners", () => {
    const svc = container.resolve(PractitionersRepository);
    expect(svc).toBeInstanceOf(PractitionersRepository);
  });
});
