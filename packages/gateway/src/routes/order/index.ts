import type { Route } from 'fast-gateway'
import { config } from '../../config'
import { auth } from '../../middlewares'

const { app: appConfig, service: serviceConfig } = config
const prefix = appConfig.prefix
const target = serviceConfig.order.baseUrl

const listRoute: Route = {
  pathRegex: '/order',
  methods: ['GET'],
  middlewares: [auth()],
  prefix,
  target,
}

const createRoute: Route = {
  pathRegex: '/order',
  methods: ['POST'],
  middlewares: [auth()],
  prefix,
  target,
}

const detailRoute: Route = {
  pathRegex: '/order/(\\w+)',
  methods: ['GET'],
  middlewares: [auth()],
  prefix,
  target,
}

const cancelRoute: Route = {
  pathRegex: '/order/(\\w+)',
  methods: ['PATCH'],
  middlewares: [auth()],
  prefix,
  target,
}

export const orderRoutes: Route[] = [
  listRoute,
  createRoute,
  detailRoute,
  cancelRoute,
]
