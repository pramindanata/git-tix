import nodeStan from 'node-nats-streaming'
import { TicketCreatedPublisher } from './pubsub'

console.clear()

const stan = nodeStan.connect('git-tix', 'abc', {
  url: 'http://localhost:4222',
})

stan.on('connect', () => {
  console.log('publisher is connected')

  // const data = JSON.stringify({
  //   id: 1,
  //   title: 'sport event',
  //   price: 20,
  // })

  // setInterval(() => {
  //   stan.publish('ticket:created', data, () => {
  //     console.log('message published')
  //   })
  // }, 1500)

  const ticketCreatedPublisher = new TicketCreatedPublisher(stan)

  setInterval(async () => {
    await ticketCreatedPublisher.publish({
      id: '1',
      title: 'someTitle',
      price: 20,
    })
  }, 1500)
})
