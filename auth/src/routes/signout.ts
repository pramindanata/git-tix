import { Router } from 'express'
import type { Request, Response } from 'express'

const router = Router()

router.post('/signout', (req: Request, res: Response) => {
  req.session = null

  return res.send('ok')
})

export { router as signOutRouter }
