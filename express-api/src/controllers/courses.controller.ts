import type { Request, Response } from 'express'
import { idParam, toSkipTake } from '../schemas/common'
import { courseBody, courseQuery } from '../schemas/course'
import { coursesService } from '../services/courses.service'

export const coursesController = {
  create: async (req: Request, res: Response) => {
    res.status(201).json(await coursesService.create(courseBody.parse(req.body)))
  },
  list: async (req: Request, res: Response) => {
    const { category, ...page } = courseQuery.parse(req.query)
    const [data, total] = await coursesService.list(category, toSkipTake(page))
    res.set('X-Total-Count', String(total)).json(data)
  },
  get: async (req: Request, res: Response) => {
    res.json(await coursesService.get(idParam.parse(req.params).id))
  },
  update: async (req: Request, res: Response) => {
    const { id } = idParam.parse(req.params)
    res.json(await coursesService.update(id, courseBody.parse(req.body)))
  },
  remove: async (req: Request, res: Response) => {
    await coursesService.remove(idParam.parse(req.params).id)
    res.status(204).send()
  },
}
