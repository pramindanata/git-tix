import nodeStan from 'node-nats-streaming';
import { Publisher } from './publisher';
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
  private connection?: nodeStan.Stan;

  connect(options: Options): Promise<nodeStan.Stan> {
    const { clientId, clusterId, url } = options;
    this.connection = nodeStan.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this.connection?.on('connect', () => {
        /* eslint-disable */
        console.log(`Connected to STAN server as ${clientId}`)

        return resolve(this.connection)
      })

      this.connection?.on('error', (err) => {
        console.error(err)

        return reject(err)
      })
    })
  }

  getConnection(): nodeStan.Stan {
    if (!this.connection) {
      throw new Error('STAN Connection does not exist')
    }

    return this.connection
  }
}
