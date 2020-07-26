import express from 'express'
import 'express-async-errors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

dotenv.config()

import config from './config'
import { currentUserRouter } from './routes/current-user'
import { signInRouter } from './routes/signin'
import { signOutRouter } from './routes/signout'
import { signUpRouter } from './routes/signup'
import { errorHandler } from './middlewares/error-handler'
import { RouteNotFoundError } from './lib/custom-error'

const app = express()
const { port } = config.app
const logger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
)

app.use(bodyParser.json())
app.use(logger)

app.use(currentUserRouter)
app.use(signInRouter)
app.use(signOutRouter)
app.use(signUpRouter)

app.all('*', async () => {
  throw new RouteNotFoundError()
})

app.use(errorHandler)

const start = async () => {
  const dbHost = config.db.host
  const dbName = config.db.name

  await mongoose.connect(`${dbHost}/${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })

  app.listen(port, () => {
    /* eslint-disable */
    console.log(`auth-service listening on http://localhost:${port}`)
  })
}

start().catch((err) => {
  /* eslint-disable */
  console.log(err)
})
