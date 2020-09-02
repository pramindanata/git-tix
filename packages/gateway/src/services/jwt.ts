import jwt from 'jsonwebtoken'
import { config } from '../config'

interface TokenPayload {
  iss: string
  id: string
  email: string
  iat: number
}

const verify = (token: string): Promise<TokenPayload> => {
  const secret = config.jwt.secret

  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return reject(err)
      }

      return resolve(decoded as TokenPayload)
    })
  })
}

export const jwtService = { verify }
