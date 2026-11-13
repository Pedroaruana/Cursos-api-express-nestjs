import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common'
import type { Request, Response } from 'express'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const req = ctx.getRequest<Request>()
    const res = ctx.getResponse<Response>()

    let status = 500
    let message = 'erro interno do servidor'
    let details: unknown

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const body = exception.getResponse()
      const raw = typeof body === 'string' ? body : (body as { message?: string | string[] }).message
      if (Array.isArray(raw)) {
        // erros do ValidationPipe
        message = 'payload invalido'
        details = raw
      } else {
        message = raw ?? exception.message
      }
    } else {
      this.logger.error(exception)
    }

    res.status(status).json({
      message,
      ...(details ? { details } : {}),
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
    })
  }
}
