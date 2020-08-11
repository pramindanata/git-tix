import nodeStan from 'node-nats-streaming'

console.clear()

const stan = nodeStan.connect('git-tix', 'abc', {
  url: 'http://localhost:4222',
})

stan.on('connect', () => {
  console.log('publisher is connected')

  const data = JSON.stringify({
    id: 1,
    title: 'sport event',
    price: 20,
  })

  setInterval(() => {
    stan.publish('ticket:created', data, () => {
      console.log('message published')
    })
  }, 1500)
})
