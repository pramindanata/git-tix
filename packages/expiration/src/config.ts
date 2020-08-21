const env = process.env

export enum AppEnv {
  dev = 'development',
  production = 'production',
  test = 'test',
}

export const config = {
  app: {
    name: env.APP_NAME || 'svc-expiration',
    env: env.NODE_ENV || AppEnv.dev,
  },
  stan: {
    clusterId: env.STAN_CLUSTER_ID || 'git-tix',
    clientId: env.STAN_CLIENT_ID || 'expiration',
    url: env.STAN_URL || 'http://localhost:4222',
  },
  domain: {
    order: {
      expirationDurationMinute:
        (env.DOMAIN_ORDER_EXPIRED_MINUTE &&
          parseInt(env.DOMAIN_ORDER_EXPIRED_MINUTE)) ||
        15,
    },
  },
}
