import express from 'express'
import 'express-async-errors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'
import { NotFoundError } from '@teh-tix/common/exception'
import { setReqContext, errorHandler } from '@teh-tix/common/middleware'

import { config, AppEnv } from './config'

import { createTicketRouter } from './routes/create'
import { getListRouter } from './routes/getList'
import { getOneRouter } from './routes/getOne'
import { updateOneRouter } from './routes/updateOne'

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
app.use('/ticket', createTicketRouter)
app.use('/ticket', getOneRouter)
app.use('/ticket', getListRouter)
app.use('/ticket', updateOneRouter)

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler())

export { app }
