import type { Route } from 'fast-gateway'
import { config } from '../../config'

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
  prefix,
  target,
}

export const ticket: Route[] = [
  listRoute,
  createRoute,
  detailRoute,
  updateRoute,
]
