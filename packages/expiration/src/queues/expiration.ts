import Queue from 'bull'
import { config } from '../config'
import { stan } from '../lib/stan'
import type { DTO } from '../interface'

const expirationQueue = new Queue<DTO.OrderExpirationJob>('order:expiration', {
  redis: {
    host: config.redis.host,
    port: config.redis.port,
  },
})

expirationQueue.process(async (job, done) => {
  console.log('Processing order:expiration queue', job.data.orderId)

  await stan.getPubs().expirationCompletePub.publish({
    orderId: job.data.orderId,
  })

  done()
})

export { expirationQueue }
