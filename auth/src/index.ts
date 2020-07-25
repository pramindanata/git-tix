import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import bodyParser from 'body-parser'

dotenv.config()

import config from './config'
import { currentUserRouter } from './routes/current-user'
import { signInRouter } from './routes/signin'
import { signOutRouter } from './routes/signout'
import { signUpRouter } from './routes/signup'
import { errorHandler } from './middlewares/error-handler'

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
app.use(errorHandler)

app.listen(port, () => {
  console.log(`auth-service listening on http://localhost:${port}`)
})
