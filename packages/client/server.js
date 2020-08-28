/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const next = require('next');
const dotenv = require('dotenv');

dotenv.config({
  path: '.env.local',
});

const serverConfig = require('./serverConfig');

const devProxy = {
  '/api/auth': {
    target: serverConfig.service.authBaseUrl,
    pathRewrite: { '^/api/auth': '/' },
    changeOrigin: true,
  },
  '/api/ticket': {
    target: serverConfig.service.ticketBaseUrl,
    pathRewrite: { '^/api/ticket': '/' },
    changeOrigin: true,
  },
  '/api/order': {
    target: serverConfig.service.orderBaseUrl,
    pathRewrite: { '^/api/order': '/' },
    changeOrigin: true,
  },
  '/api/payment': {
    target: serverConfig.service.paymentBaseUrl,
    pathRewrite: { '^/api/payment': '/' },
    changeOrigin: true,
  },
};

const port = parseInt(serverConfig.app.port, 10) || 3000;
const env = serverConfig.app.env;
const isDev = env !== 'production';
const app = next({
  dir: '.', // base directory where everything is, could move to src later
  dev: isDev,
});

const handle = app.getRequestHandler();

let server;

app
  .prepare()
  .then(() => {
    server = express();

    // Set up the proxy.
    if (isDev) {
      /* eslint-disable */
      const { createProxyMiddleware } = require('http-proxy-middleware');
      Object.keys(devProxy).forEach(function (context) {
        server.use(createProxyMiddleware(context, devProxy[context]));
      });
    }

    // Default catch-all handler to allow Next.js to handle all other routes
    server.all('*', (req, res) => handle(req, res));

    server.listen(port, (err) => {
      if (err) {
        throw err;
      }

      /* eslint-disable */
      console.log(`> Ready on port ${port} [${env}]`);
    });
  })
  .catch((err) => {
    /* eslint-disable */
    console.log('An error occurred, unable to start the server');
    console.log(err);
  });
