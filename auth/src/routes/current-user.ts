import { Router } from 'express'
import jwt from 'jsonwebtoken'
import type { Request, Response } from 'express'

import config from '../config'
import { UnauthorizedError } from '../exception'

const router = Router()

router.get('/current-user', (req: Request, res: Response) => {
  const token = req.session?.token as string | null

  if (!token) {
    throw new UnauthorizedError()
  }

  try {
    const tokenPayload = jwt.verify(token, config.jwt.secret)

    return res.json({
      data: tokenPayload,
    })
  } catch (err) {
    throw new UnauthorizedError()
  }
})

export { router as currentUserRouter }
