import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import type { Request, Response } from 'express'

import config from '../config'
import { User } from '../models/user'
import { RequestValidationError, ActionFailError } from '../lib/custom-error'

const router = Router()

interface SignUpPayload {
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
  async (req: Request<any, any, SignUpPayload>, res: Response) => {
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

    const userToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      config.jwt.secret,
    )

    req.session = {
      ...req.session,
      token: userToken,
    }

    return res.status(201).send('User created')
  },
)

export { router as signUpRouter }
