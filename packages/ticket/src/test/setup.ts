import dotenv from 'dotenv'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { AppEnv } from '../config'

dotenv.config()
process.env.NODE_ENV = AppEnv.test

let mongo: MongoMemoryServer

beforeAll(async () => {
  const mongooseConnectionState = mongoose.connection.readyState

  if (![0, 3].includes(mongooseConnectionState)) {
    await mongoose.connection.close()
    await mongo.stop()
  }

  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()

  for (const collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongoose.connection.close()
  await mongo.stop()
})
