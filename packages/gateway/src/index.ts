import dotenv from 'dotenv'

dotenv.config()

import gateway from 'fast-gateway'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { config } from './config'
import { authRoutes, ticketRoutes } from './routes'

const { app: appConfig } = config
const logger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
)

const server = gateway({
  middlewares: [logger, cookieParser()],
  routes: [...authRoutes, ...ticketRoutes],
})

server.start(appConfig.port).then(() => {
  // eslint-disable-next-line no-console
  console.log(
    `${appConfig.name} is listening on http://localhost:${appConfig.port}`,
  )
})
