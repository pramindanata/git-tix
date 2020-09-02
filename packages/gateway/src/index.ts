import dotenv from 'dotenv'

dotenv.config()

import gateway from 'fast-gateway'
import cookieParser from 'cookie-parser'
import { config } from './config'
import { authRoutes, ticketRoutes } from './routes'

const { app: appConfig } = config

const server = gateway({
  middlewares: [cookieParser()],
  routes: [...authRoutes, ...ticketRoutes],
})

// eslint-disable-next-line no-console
console.log(
  `${appConfig.name} is listening on http://localhost:${appConfig.port}`,
)

server.start(appConfig.port)
