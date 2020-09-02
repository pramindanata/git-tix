import express from 'express'
import 'express-async-errors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { NotFoundError } from '@teh-tix/common/exception'
import { setReqContext, errorHandler } from '@teh-tix/common/middleware'

import { config, AppEnv } from './config'

import { createTicketRouter } from './routes/create'
import { getListRouter } from './routes/getList'
import { getOneRouter } from './routes/getOne'
import { updateOneRouter } from './routes/updateOne'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import appPackage from '../package.json'

const app = express()
const logger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
)
const appEnv = config.app.env

app.set('trust proxy', true)
app.use(cookieParser())
app.use(bodyParser.json())

if (appEnv !== AppEnv.test) {
  app.use(logger)
}

app.use(setReqContext())

app.get('/', (req, res) => {
  res.json({
    name: config.app.name,
    version: appPackage.version,
    env: config.app.env,
  })
})

app.use(createTicketRouter)
app.use(getOneRouter)
app.use(getListRouter)
app.use(updateOneRouter)

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler())

export { app }
