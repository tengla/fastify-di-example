
export abstract class UseCase<T, R> {
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