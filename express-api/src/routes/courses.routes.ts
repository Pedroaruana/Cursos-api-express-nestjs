import { Router } from 'express'
import { coursesController as c } from '../controllers/courses.controller'

export const coursesRoutes = Router()
coursesRoutes.post('/', c.create)
coursesRoutes.get('/', c.list)
coursesRoutes.get('/:id', c.get)
coursesRoutes.put('/:id', c.update)
coursesRoutes.delete('/:id', c.remove)
