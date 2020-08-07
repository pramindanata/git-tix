import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

import { config } from './config'
import { app } from './app'

const start = async () => {
  const dbHost = config.db.host
  const dbName = config.db.name

  await mongoose.connect(`${dbHost}/${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })

  app.listen(config.app.port, () => {
    /* eslint-disable */
    console.log(`ticket-service listening on http://localhost:${config.app.port}`)
  })
}

start().catch((err) => {
  /* eslint-disable */
  console.log(err)
})
