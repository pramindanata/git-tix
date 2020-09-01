import express from 'express'
import 'express-async-errors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'
import { NotFoundError } from '@teh-tix/common/exception'
import { setReqContext, errorHandler } from '@teh-tix/common/middleware'

import { config, AppEnv } from './config'
import { currentUserRouter } from './routes/current-user'
import { signInRouter } from './routes/signin'
import { signOutRouter } from './routes/signout'
import { signUpRouter } from './routes/signup'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import appPackage from '../package.json'

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

app.get('/', (req, res) => {
  res.json({
    name: config.app.name,
    version: appPackage.version,
    env: config.app.env,
  })
})

app.use(currentUserRouter)
app.use(signInRouter)
app.use(signOutRouter)
app.use(signUpRouter)

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler())

export { app }
