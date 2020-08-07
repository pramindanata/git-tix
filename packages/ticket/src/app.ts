import express from 'express'
import 'express-async-errors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'
import { RouteNotFoundError } from '@teh-tix/common/exception'
import { setReqContext, errorHandler } from '@teh-tix/common/middleware'

import { config, AppEnv } from './config'

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

app.all('*', async () => {
  throw new RouteNotFoundError()
})

app.use(errorHandler())

export { app }
