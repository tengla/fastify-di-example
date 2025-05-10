import type { UserProvider } from "@/packages/decorators/audit.decorator";

export abstract class UseCase<T, R> {
  tableName?: string | null = null;
  userProvider?: UserProvider = {
    getCurrentUserId: async () => {
      return null;
    }
  };
  abstract execute(input: T): R | Promise<R>;
}

export class UseCaseError extends Error {
  httpCode: number;
  constructor(message: string, code: number, options?: ErrorOptions) {
    super(message, options);
    this.name = "UseCaseError";
    this.httpCode = code;
  }
}