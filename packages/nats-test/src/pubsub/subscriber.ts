import nodeStan from 'node-nats-streaming'
import { Event as IEvent } from './interface'

export abstract class Subscriber<Event extends IEvent> {
  private stan: nodeStan.Stan
  protected ackWait = 5 * 1000
  abstract readonly queueGroupName: string
  abstract readonly subject: Event['subject']

  constructor(stan: nodeStan.Stan) {
    this.stan = stan
  }

  abstract handle(
    data: Event['data'],
    msg: nodeStan.Message,
  ): void | Promise<void>

  getSubscriptionOptions(): nodeStan.SubscriptionOptions {
    return this.stan
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName)
  }

  listen(): void {
    const options = this.getSubscriptionOptions()
    const subscriber = this.stan.subscribe(
      this.subject,
      this.queueGroupName,
      options,
    )

    subscriber.on('message', (msg: nodeStan.Message) => {
      const data = this.parseMessage(msg)

      console.log(`Message received: ${this.subject}/${this.queueGroupName}`)

      this.handle(data, msg)
    })
  }

  private parseMessage(msg: nodeStan.Message) {
    const data = msg.getData()

    return JSON.parse(data.toString('utf-8'))
  }
}
