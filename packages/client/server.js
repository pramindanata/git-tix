/* eslint-disable */
const express = require('express');
const next = require('next');
const dotenv = require('dotenv');
const config = require('./serverConfig')

dotenv.config();

const devProxy = {
  '/api/auth': {
    target: config.service.authBaseUrl,
    pathRewrite: { '^/api/auth': '/' },
    changeOrigin: true,
  },
};

const port = parseInt(config.app.port, 10) || 3000;
const env = config.app.env;
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
    if (isDev && devProxy) {
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
