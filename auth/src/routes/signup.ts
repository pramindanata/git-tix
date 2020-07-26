import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import type { Request, Response } from 'express'
import { User } from '../models/user'
import { RequestValidationError, ActionFailError } from '../lib/custom-error'

const router = Router()

interface SignUpBody {
  email: string
  password: string
}

router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .isLength({ min: 4, max: 20 })
      .withMessage('Password mus be between 4 and 20 characters'),
  ],
  async (req: Request<any, any, SignUpBody>, res: Response) => {
    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
      throw new RequestValidationError(validationErrors.array())
    }

    const { email, password } = req.body
    const userWithSameEmail = await User.findOne({ email })

    if (userWithSameEmail) {
      throw new ActionFailError('EMAIL_TAKEN')
    }

    const user = User.build({ email, password })
    await user.save()

    return res.status(201).send('User created')
  },
)

export { router as signUpRouter }
