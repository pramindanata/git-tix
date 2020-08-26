const env = process.env;

module.exports = {
  app: {
    port: env.APP_PORT || 3000,
    env: env.NODE_ENV || 'development',
    useLocalProxy: env.APP_USE_LOCAL_PROXY === 'true' || false,
  },
  service: {
    authBaseUrl: env.SERVICE_AUTH_URL || 'http://localhost:4000',
    ticketBaseUrl: env.SERVICE_TICKET_URL || 'http://localhost:4001',
    orderBaseUrl: env.SERVICE_ORDER_URL || 'http://localhost:4002',
    paymentBaseUrl: env.SERVICE_PAYMENT_URL || 'http://localhost:4003',
  },
};
