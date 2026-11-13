import type { Request, Response } from 'express'
import { idParam } from '../schemas/common'
import { enrollmentBody } from '../schemas/enrollment'
import { enrollmentsService } from '../services/enrollments.service'

export const enrollmentsController = {
  create: async (req: Request, res: Response) => {
    res.status(201).json(await enrollmentsService.create(enrollmentBody.parse(req.body)))
  },
  remove: async (req: Request, res: Response) => {
    await enrollmentsService.remove(idParam.parse(req.params).id)
    res.status(204).send()
  },
}
