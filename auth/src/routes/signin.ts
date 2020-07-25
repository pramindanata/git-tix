import { Router } from 'express'

const router = Router()

router.post('/signin', (req, res) => {
  return res.send('ok')
})

export { router as signInRouter }
