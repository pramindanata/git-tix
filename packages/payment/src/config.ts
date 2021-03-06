const env = process.env

export enum AppEnv {
  dev = 'development',
  production = 'production',
  test = 'test',
}

export const config = {
  app: {
    name: env.APP_NAME || 'svc-payment',
    env: env.NODE_ENV || AppEnv.dev,
    port: env.APP_PORT || '4001',
    useHttps: env.APP_USE_HTTPS === 'true' || false,
  },
  db: {
    host: env.DB_HOST || 'mongodb://localhost:27017',
    name: env.DB_NAME || 'payment',
  },
  jwt: {
    secret: env.JWT_SECRET || 'jsonwebtoken_secret_123!',
  },
  stan: {
    clusterId: env.STAN_CLUSTER_ID || 'git-tix',
    clientId: env.STAN_CLIENT_ID || 'payment',
    url: env.STAN_URL || 'http://localhost:4222',
  },
  stripe: {
    secret: env.STRIPE_SECRET,
  },
}
