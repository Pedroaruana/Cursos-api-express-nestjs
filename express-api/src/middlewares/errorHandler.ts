import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../errors/AppError'

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  let status = 500
  let message = 'erro interno do servidor'
  let details: unknown

  if (err instanceof AppError) {
    status = err.status
    message = err.message
    details = err.details
  } else if (err instanceof ZodError) {
    status = 422
    message = 'payload invalido'
    details = err.issues.map((i) => ({ field: i.path.join('.'), message: i.message }))
  } else if (err instanceof SyntaxError && 'body' in err) {
    status = 400
    message = 'JSON malformado'
  } else {
    console.error(err)
  }

  res.status(status).json({
    message,
    ...(details ? { details } : {}),
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  })
}
