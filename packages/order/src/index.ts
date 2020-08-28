import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

import { stan } from './lib/stan'
import { config } from './config'

import { app } from './app'

const start = async () => {
  const { db: dbConfig, stan: stanConfig, app: appConfig } = config

  await stan.connect({
    clusterId: stanConfig.clusterId,
    clientId: stanConfig.clientId,
    url: stanConfig.url,
  })

  await mongoose.connect(`${dbConfig.host}/${dbConfig.name}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })

  stan.getInstance().on('close', () => {
    /* eslint-disable */
    console.log('# STAN connection closed')
    process.exit()
  })

  process.on('SIGINT', () => stan.getInstance().close())
  process.on('SIGTERM', () => stan.getInstance().close())

  app.listen(config.app.port, () => {
    /* eslint-disable */
    console.log('testing')
    console.log(`# order-service is listening on http://localhost:${appConfig.port}`)
  })
}

start().catch((err) => {
  /* eslint-disable */
  console.log(err)
})
