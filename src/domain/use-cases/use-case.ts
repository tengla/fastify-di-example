
export abstract class UseCase<T, R> {
  abstract execute(input: T): R | Promise<R>;
}