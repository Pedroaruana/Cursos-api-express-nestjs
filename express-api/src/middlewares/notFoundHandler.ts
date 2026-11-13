import type { RequestHandler } from 'express'
import { AppError } from '../errors/AppError'

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new AppError(404, `rota ${req.method} ${req.originalUrl} nao encontrada`))
}
