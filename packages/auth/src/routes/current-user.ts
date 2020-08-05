import { Router } from 'express'
import type { Request, Response } from 'express'
import { auth } from '../middlewares/auth'

const router = Router()

router.get('/current-user', auth, (req: Request, res: Response) => {
  return res.json({
    data: req.ctx.authUser,
  })
})

export { router as currentUserRouter }
