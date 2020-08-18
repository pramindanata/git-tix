import nodeStan from 'node-nats-streaming';
import { Publisher } from './publisher';
import { Subscriber } from './subscriber';
import type { Event } from './interface';

interface Options {
  clusterId: string;
  clientId: string;
  url: string;
}

type PublisherDict = {
  [key: string]: Publisher<Event>;
};

export interface Publishable {
  // Make sure to init pubs after STAN connection created
  getPubs(): PublisherDict;
}

export abstract class StanClient {
  private stan?: nodeStan.Stan;
  private subscribers: Subscriber<Event>[] = [];
  protected createSubscribers?: (stan: nodeStan.Stan) => Subscriber<Event>[];

  connect(options: Options): Promise<nodeStan.Stan> {
    const { clientId, clusterId, url } = options;
    this.stan = nodeStan.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this.stan?.on('connect', () => {
        /* eslint-disable */
        console.log(`Connected to STAN server as ${clientId}`)

        if (this.createSubscribers) {
          this.subscribers = this.createSubscribers(this.stan!)
        }

        this.attachSubscribers()

        return resolve(this.stan)
      })

      this.stan?.on('error', (err) => {
        console.error(err)

        return reject(err)
      })
    })
  }

  getInstance(): nodeStan.Stan {
    if (!this.stan) {
      throw new Error('STAN Connection does not exist')
    }

    return this.stan
  }

  private attachSubscribers(): void {
    const subscribersLength = this.subscribers.length

    console.log('# Attaching STAN Subscriber')

    for (const subscriber of this.subscribers) {
      console.log(`> ${subscriber.subject} attached`)

      subscriber.listen()
    }

    console.log(`${subscribersLength} STAN subscriber(s) attached`)
  }
}
