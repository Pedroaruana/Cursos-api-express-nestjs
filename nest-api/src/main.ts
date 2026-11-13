import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'
import { configureApp, setupSwagger } from './app.setup.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  configureApp(app)
  setupSwagger(app)
  const port = process.env.PORT ?? 3000
  await app.listen(port)
  console.log(`API rodando em http://localhost:${port} (docs em /docs)`)
}
await bootstrap()
