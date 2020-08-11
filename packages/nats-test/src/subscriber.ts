import nodeStan, { Message } from 'node-nats-streaming'
import { randomBytes } from 'crypto'

console.clear()

const clientId = randomBytes(4).toString('hex')
const stan = nodeStan.connect('git-tix', 'some-client-id3', {
  url: 'http://localhost:4222',
})
const getStanData = <Result = any>(msg: Message): Result => {
  const data = msg.getData()

  return JSON.parse(data.toString())
}

stan.on('connect', () => {
  console.log('subscriber is connected')

  stan.on('close', () => {
    console.log('STAN connection closed')
    process.exit()
  })

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName('nats-test')

  const ticketCreatedSubscriber = stan.subscribe('ticket:created', options)

  ticketCreatedSubscriber.on('message', (msg: Message) => {
    const data = getStanData(msg)
    const sequence = msg.getSequence()

    console.log(`Received message #${sequence}:`, data)

    msg.ack()
  })
})

process.on('SIGINT', () => stan.close())
process.on('SIGTERM', () => stan.close())
