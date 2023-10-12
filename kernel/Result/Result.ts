export class Result<T> {
  constructor(
    public readonly data: T | null = null,
    public readonly error: Error | null = null,
  ) {}

  static ok<T>(data?: T): Result<T> {
    return new Result(data, null);
  }

  static fail<T>(error: Error): Result<T> {
    return new Result(null, error);
  }

  isSuccess(): boolean {
    return this.data !== null;
  }

  isFailure(): boolean {
    return this.error !== null;
  }

  getData(defaultValue: T): T {
    return this.isSuccess() ? (this.data as T) : defaultValue;
  }

  getError(defaultValue: Error): Error {
    return this.isFailure() ? (this.error as Error) : defaultValue;
  }
}
