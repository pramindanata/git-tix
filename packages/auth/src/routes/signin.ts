import { Router } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import { validateRequestPayload } from '@teh-tix/common/middleware'
import { ActionFailError, ActionFailType } from '@teh-tix/common/exception'
import type { Request, Response } from 'express'

import { config } from '../config'
import { User } from '../models/user'
import { Password } from '../services/password'

interface SignInPayload {
  email: string
  password: string
}

const router = Router()

router.post(
  '/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty(),
  ],
  validateRequestPayload(),
  async (req: Request<any, any, SignInPayload>, res: Response) => {
    const { email, password } = req.body
    const existingUser = await User.findOne({ email })

    if (!existingUser) {
      throw new ActionFailError(ActionFailType.INVALID_CREDENTIAL)
    }

    const isPasswordMatch = await Password.compare(
      existingUser.password,
      password,
    )

    if (!isPasswordMatch) {
      throw new ActionFailError(ActionFailType.INVALID_CREDENTIAL)
    }

    const userToken = jwt.sign(
      {
        iss: config.app.name,
        id: existingUser.id,
        email: existingUser.email,
      },
      config.jwt.secret,
    )

    res.cookie('token', userToken, {
      httpOnly: true,
    })

    return res.send('ok')
  },
)

export { router as signInRouter }
