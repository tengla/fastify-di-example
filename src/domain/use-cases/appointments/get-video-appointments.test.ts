import "reflect-metadata/lite";
import { describe, test } from "vitest";
import { GetVideoAppointmentsUseCase } from "./get-video-appointments";
import { container } from "tsyringe";

describe("GetVideoAppointmentsUseCase", () => {
  test("should get video appointments", async () => {
    const a = container.resolve(GetVideoAppointmentsUseCase);
    const record = await a.execute("test");
    console.log("record:", record);
  });
});