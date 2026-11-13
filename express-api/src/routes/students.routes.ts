import { Router } from 'express'
import { studentsController as c } from '../controllers/students.controller'

export const studentsRoutes = Router()
studentsRoutes.post('/', c.create)
studentsRoutes.get('/', c.list)
studentsRoutes.get('/:id', c.get)
studentsRoutes.put('/:id', c.update)
studentsRoutes.delete('/:id', c.remove)
studentsRoutes.get('/:id/enrollments', c.enrollments)
