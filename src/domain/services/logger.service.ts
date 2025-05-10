import pino from "pino";
import { container } from "tsyringe";

export const Logger = pino({
  level: "debug",
  nestedKey: 'payload',
  messageKey: 'message',
  formatters: {
    level(label) {
      return { severity: label.toUpperCase() };
    },
  },
});

export const LoggerService = Symbol("LoggerService");

container.registerInstance(LoggerService, Logger);
