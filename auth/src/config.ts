const env = process.env

const config = {
  app: {
    port: env.APP_PORT || '4000',
  },
  db: {
    host: env.DB_HOST || 'mongodb://localhost:27017',
    name: env.DB_NAME || 'auth',
  },
}

export default config
