import { Router } from 'express'
import { enrollmentsController as c } from '../controllers/enrollments.controller'

export const enrollmentsRoutes = Router()
enrollmentsRoutes.post('/', c.create)
enrollmentsRoutes.delete('/:id', c.remove)
