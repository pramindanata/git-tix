import type { Route } from 'fast-gateway'
import { config } from '../../config'

const { app: appConfig, service: serviceConfig } = config
const prefix = appConfig.prefix
const target = serviceConfig.auth.baseUrl

const signInRoute: Route = {
  pathRegex: '/signin',
  methods: ['POST'],
  prefix,
  target,
}

const signUpRoute: Route = {
  pathRegex: '/signup',
  methods: ['POST'],
  prefix,
  target,
}

const currentUserRoute: Route = {
  pathRegex: '/current-user',
  methods: ['GET'],
  prefix,
  target,
}

export const authRoutes: Route[] = [signInRoute, signUpRoute, currentUserRoute]
