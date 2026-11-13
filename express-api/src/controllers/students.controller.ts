import type { Request, Response } from 'express'
import { idParam, toSkipTake } from '../schemas/common'
import { studentBody, studentQuery } from '../schemas/student'
import { enrollmentsService } from '../services/enrollments.service'
import { studentsService } from '../services/students.service'

export const studentsController = {
  create: async (req: Request, res: Response) => {
    res.status(201).json(await studentsService.create(studentBody.parse(req.body)))
  },
  list: async (req: Request, res: Response) => {
    const [data, total] = await studentsService.list(toSkipTake(studentQuery.parse(req.query)))
    res.set('X-Total-Count', String(total)).json(data)
  },
  get: async (req: Request, res: Response) => {
    res.json(await studentsService.get(idParam.parse(req.params).id))
  },
  update: async (req: Request, res: Response) => {
    const { id } = idParam.parse(req.params)
    res.json(await studentsService.update(id, studentBody.parse(req.body)))
  },
  remove: async (req: Request, res: Response) => {
    await studentsService.remove(idParam.parse(req.params).id)
    res.status(204).send()
  },
  enrollments: async (req: Request, res: Response) => {
    res.json(await enrollmentsService.listByStudent(idParam.parse(req.params).id))
  },
}
