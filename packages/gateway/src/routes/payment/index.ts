import type { Route } from 'fast-gateway'
import { config } from '../../config'
import { auth } from '../../middlewares'

const { app: appConfig, service: serviceConfig } = config
const prefix = appConfig.prefix
const target = serviceConfig.payment.baseUrl

const createRoute: Route = {
  pathRegex: '/payment',
  methods: ['POST'],
  middlewares: [auth()],
  prefix,
  target,
}

export const paymentRoutes: Route[] = [createRoute]
