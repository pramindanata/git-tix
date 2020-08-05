import { Router } from 'express'
import { auth } from '@teh-tix/common'
import type { Request, Response } from 'express'

const router = Router()

router.get('/current-user', auth(), (req: Request, res: Response) => {
  return res.json({
    data: req.ctx.authUser,
  })
})

export { router as currentUserRouter }
