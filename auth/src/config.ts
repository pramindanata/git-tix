const env = process.env

const config = {
  app: {
    port: env.APP_PORT || '4000',
  },
}

export default config
