import type { Route } from 'fast-gateway'
import { config } from '../../config'
import { auth } from '../../middlewares'

const { app: appConfig, service: serviceConfig } = config
const prefix = appConfig.prefix
const target = serviceConfig.ticket.baseUrl

const listRoute: Route = {
  pathRegex: '/ticket',
  methods: ['GET'],
  prefix,
  target,
}

const createRoute: Route = {
  pathRegex: '/ticket',
  methods: ['POST'],
  middlewares: [auth()],
  prefix,
  target,
}

const detailRoute: Route = {
  pathRegex: '/ticket/(\\w+)',
  methods: ['GET'],
  prefix,
  target,
}

const updateRoute: Route = {
  pathRegex: '/ticket/(\\w+)',
  methods: ['PUT'],
  middlewares: [auth()],
  prefix,
  target,
}

export const ticketRoutes: Route[] = [
  listRoute,
  createRoute,
  detailRoute,
  updateRoute,
]
