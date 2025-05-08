import "reflect-metadata";
import { describe, expect, it, beforeEach } from "vitest";
import { container } from "tsyringe";
import { PractitionersRepository } from "./practitioners";
import { UsersRepository } from "./users";
import { PatientsRepository } from "./patients";
import { AppointmentsRepository } from "./appointments";
import { AuditsRepository } from "./audits";

// This is a simple integration test to ensure the repositories are working correctly
describe("BaseRepository", () => {
  beforeEach(() => {
    // Reset the container for each test to ensure clean state
    container.clearInstances();
  });

  it("should allow instantiating all repositories without errors", () => {
    const repositories = [
      container.resolve(PractitionersRepository),
      container.resolve(UsersRepository),
      container.resolve(PatientsRepository),
      container.resolve(AppointmentsRepository),
      container.resolve(AuditsRepository),
    ];

    repositories.forEach(repo => {
      expect(repo).toBeDefined();
    });
  });

  it("should have all CRUD methods available", () => {
    const repo = container.resolve(UsersRepository);
    
    expect(typeof repo.create).toBe("function");
    expect(typeof repo.read).toBe("function");
    expect(typeof repo.update).toBe("function");
    expect(typeof repo.delete).toBe("function");
    expect(typeof repo.list).toBe("function");
    expect(typeof repo.findBy).toBe("function");
    expect(typeof repo.findAllBy).toBe("function");
    expect(typeof repo.count).toBe("function");
    expect(typeof repo.exists).toBe("function");
  });
});