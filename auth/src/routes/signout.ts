import { Router } from 'express'

const router = Router()

router.post('/signout', (req, res) => {
  return res.send('ok')
})

export { router as signOutRouter }
