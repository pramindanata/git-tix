import Queue from 'bull'
import { config } from '../config'
import { DTO } from '../interface'

const expirationQueue = new Queue<DTO.OrderExpirationJob>('order:expiration', {
  redis: {
    host: config.redis.host,
    port: config.redis.port,
  },
})

expirationQueue.process(async (job, done) => {
  console.log('Processing order:expiration queue', job.data.orderId)

  done()
})

export { expirationQueue }
