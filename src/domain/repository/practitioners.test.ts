import "reflect-metadata/lite";
import { describe, expect, test, beforeAll } from "vitest";
import { PractitionersRepository } from "./practitioners";
import { UsersRepository } from "./users";
import { container } from "tsyringe";

const userRepo = container.resolve(UsersRepository);
const practitionerRepo = container.resolve(PractitionersRepository);

describe("PractitionersRepository", () => {

  beforeAll(async () => {
    await userRepo.deleteAll();
    await practitionerRepo.deleteAll();
  });

  test("practitioners", async () => {
    const user = await userRepo.create({
      email: "john@example.com",
      password: "password",
      username: "john",
    });
    const practitioner = await practitionerRepo.create({
      user_id: user.id!,
      name: "John doe",
      email: user.email,
    });
    expect(practitioner).toEqual({
      id: expect.any(Number),
      user_id: user.id,
      name: "John doe",
      email: user.email,
      created_at: expect.any(String),
    });
  });
});
