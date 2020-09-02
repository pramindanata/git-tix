const env = process.env

export enum AppEnv {
  dev = 'development',
  production = 'production',
  test = 'test',
}

export const config = {
  app: {
    env: env.NODE_ENV || AppEnv.dev,
    name: env.APP_NAME || 'gateway',
    port: (env.APP_PORT && parseInt(env.APP_PORT)) || 8080,
    prefix: env.APP_PREFIX || '/v1',
  },
  service: {
    auth: {
      baseUrl: env.SERVICE_AUTH_URL || 'http://localhost:4000',
    },
    ticket: {
      baseUrl: env.SERVICE_TICKET_URL || 'http://localhost:4001',
    },
  },
  jwt: {
    secret: env.JWT_SECRET || 'my-secret-123',
  },
}
