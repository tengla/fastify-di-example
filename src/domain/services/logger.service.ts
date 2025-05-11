import pino, { stdTimeFunctions } from "pino";
import { container } from "tsyringe";

export const Logger = pino({
  level: "debug",
  nestedKey: 'payload',
  messageKey: 'message',
  timestamp: stdTimeFunctions.isoTime,
  formatters: {
    level(label) {
      return { severity: label.toUpperCase() };
    },
  },
});

export const LoggerService = Symbol("LoggerService");

container.registerInstance(LoggerService, Logger);
