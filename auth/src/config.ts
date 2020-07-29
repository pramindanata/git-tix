const env = process.env

const config = {
  app: {
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

export default config
