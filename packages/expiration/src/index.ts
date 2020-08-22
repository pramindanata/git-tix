import dotenv from 'dotenv'

dotenv.config()

import { stan } from './lib/stan'
import { config } from './config'

const start = async () => {
  const { stan: stanConfig } = config

  await stan.connect({
    clusterId: stanConfig.clusterId,
    clientId: stanConfig.clientId,
    url: stanConfig.url,
  })

  stan.getInstance().on('close', () => {
    /* eslint-disable */
    console.log('#STAN connection closed')
    process.exit()
  })

  process.on('SIGINT', () => stan.getInstance().close())
  process.on('SIGTERM', () => stan.getInstance().close())
}

start()
  .then(() => {
    console.log('# expiration-service is listening')
  })
  .catch((err) => {
    /* eslint-disable */
    console.log(err)
  })
