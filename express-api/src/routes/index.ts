import { Router } from 'express'
import { coursesRoutes } from './courses.routes'
import { enrollmentsRoutes } from './enrollments.routes'
import { studentsRoutes } from './students.routes'

export const apiRoutes = Router()
apiRoutes.use('/courses', coursesRoutes)
apiRoutes.use('/students', studentsRoutes)
apiRoutes.use('/enrollments', enrollmentsRoutes)
