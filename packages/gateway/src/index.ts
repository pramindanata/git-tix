import gateway from 'fast-gateway'
import { config } from './config'

const { app: appConfig, service: serviceConfig } = config

const server = gateway({
  routes: [
    {
      prefix: appConfig.prefix,
      pathRegex: '/current-user',
      methods: ['GET'],
      target: serviceConfig.auth.baseUrl,
    },
    {
      prefix: appConfig.prefix,
      pathRegex: '/signin',
      methods: ['POST'],
      target: serviceConfig.auth.baseUrl,
    },
    {
      prefix: appConfig.prefix,
      pathRegex: '/ticket',
      methods: ['GET'],
      target: serviceConfig.ticket.baseUrl,
    },
    {
      prefix: appConfig.prefix,
      pathRegex: '/ticket/(\\w+)',
      methods: ['GET'],
      target: serviceConfig.ticket.baseUrl,
    },
  ],
})

// eslint-disable-next-line no-console
console.log(
  `${appConfig.name} is listening on http://localhost:${appConfig.port}`,
)

server.start(appConfig.port)
