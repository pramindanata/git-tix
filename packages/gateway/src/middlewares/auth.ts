import type { RequestHandler, Protocol } from 'restana'
import { jwtService } from '../services'

export const auth = (): RequestHandler<Protocol.HTTP> => async (
  req,
  res,
  next,
): Promise<any> => {
  const token = req.cookies.token

  try {
    await jwtService.verify(token)

    next()
  } catch (err) {
    return res.send(
      {
        message: 'Invalid token given',
      },
      401,
    )
  }
}
