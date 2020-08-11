import nodeStan from 'node-nats-streaming'
import { randomBytes } from 'crypto'
import { TicketCreatedSubscriber } from './pubsub/ticket-created-subscriber'

console.clear()

const clientId = randomBytes(4).toString('hex')
const stan = nodeStan.connect('git-tix', clientId, {
  url: 'http://localhost:4222',
})

stan.on('connect', () => {
  console.log('subscriber is connected')

  stan.on('close', () => {
    console.log('STAN connection closed')
    process.exit()
  })

  new TicketCreatedSubscriber(stan).listen()
})

process.on('SIGINT', () => stan.close())
process.on('SIGTERM', () => stan.close())
