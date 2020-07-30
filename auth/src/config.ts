const env = process.env

export enum AppEnv {
  dev = 'dev',
  production = 'production',
  test = 'test',
}

export const config = {
  app: {
    env: env.NODE_ENV || AppEnv.dev,
    port: env.APP_PORT || '4000',
    useHttps: env.APP_USE_HTTPS === 'true' || false,
  },
  db: {
    host: env.DB_HOST || 'mongodb://localhost:27017',
    name: env.DB_NAME || 'auth',
  },
  jwt: {
    secret: env.JWT_SECRET || 'jsonwebtoken_secret_123!',
  },
}
