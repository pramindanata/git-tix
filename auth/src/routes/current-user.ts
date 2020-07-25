import { Router } from 'express'

const router = Router()

router.get('/current-user', (req, res) => {
  return res.send('ok')
})

export { router as currentUserRouter }
