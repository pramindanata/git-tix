import express from 'express'
import 'express-async-errors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'
import {
  RouteNotFoundError,
  setReqContext,
  errorHandler,
} from '@teh-tix/common'

import { config, AppEnv } from './config'
import { currentUserRouter } from './routes/current-user'
import { signInRouter } from './routes/signin'
import { signOutRouter } from './routes/signout'
import { signUpRouter } from './routes/signup'

const app = express()
const logger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
)
const appEnv = config.app.env

app.set('trust proxy', true)
app.use(
  cookieSession({
    signed: false,
    secure: config.app.useHttps,
  }),
)
app.use(bodyParser.json())

if (appEnv !== AppEnv.test) {
  app.use(logger)
}

app.use(setReqContext(config.jwt.secret))

app.use(currentUserRouter)
app.use(signInRouter)
app.use(signOutRouter)
app.use(signUpRouter)

app.all('*', async () => {
  throw new RouteNotFoundError()
})

app.use(errorHandler())

export { app }
