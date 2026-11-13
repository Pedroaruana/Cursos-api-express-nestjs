import { INestApplication, ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AllExceptionsFilter } from './common/all-exceptions.filter.js'

// Usado no main.ts e nos testes, para ambos rodarem com a mesma configuracao
export const configureApp = (app: INestApplication) => {
  app.setGlobalPrefix('api', { exclude: ['health'] })
  app.enableCors()
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      errorHttpStatusCode: 422,
    }),
  )
  app.useGlobalFilters(new AllExceptionsFilter())
}

export const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder().setTitle('API de Catalogo de Cursos').setVersion('1.0.0').build()
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config))
}
