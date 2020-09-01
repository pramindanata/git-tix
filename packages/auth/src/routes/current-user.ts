import { Router } from 'express'
import type { Request, Response } from 'express'

const router = Router()

router.get('/current-user', (req: Request, res: Response) => {
  return res.json({
    data: req.ctx.authUser,
  })
})

export { router as currentUserRouter }
