const env = process.env;

module.exports = {
  app: {
    port: env.APP_PORT || 3000,
    env: env.NODE_ENV || 'development',
  },
  service: {
    authBaseUrl: env.SERVICE_AUTH_URL || 'http://localhost:4000',
  },
};