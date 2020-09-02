import gateway from 'fast-gateway'
import { config } from './config'
import { auth, ticket } from './routes'

const { app: appConfig } = config

const server = gateway({
  routes: [...auth, ...ticket],
})

// eslint-disable-next-line no-console
console.log(
  `${appConfig.name} is listening on http://localhost:${appConfig.port}`,
)

server.start(appConfig.port)
