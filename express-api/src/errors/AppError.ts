export class AppError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message)
  }
}

export const notFound = (what: string) => new AppError(404, `${what} nao encontrado`)
