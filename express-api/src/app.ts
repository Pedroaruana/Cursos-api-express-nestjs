import cors from 'cors'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { openapi } from './docs/openapi'
import { errorHandler } from './middlewares/errorHandler'
import { notFoundHandler } from './middlewares/notFoundHandler'
import { apiRoutes } from './routes'

export const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi))
app.use('/api', apiRoutes)

app.use(notFoundHandler)
app.use(errorHandler)
