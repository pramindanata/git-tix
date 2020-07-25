import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import type { Request, Response } from 'express'
import { RequestValidationError, DBConnectionError } from '../lib/custom-error'

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
  (req: Request<any, any, SignUpBody>, res: Response) => {
    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
      throw new RequestValidationError(validationErrors.array())
    }

    throw new DBConnectionError()

    // const { email, password } = req.body

    return res.status(201).send('User created')
  },
)

export { router as signUpRouter }
