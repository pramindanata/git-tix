import nodeStan from 'node-nats-streaming'
import * as pubs from '../events/pubs'

interface Options {
  clusterId: string
  clientId: string
  url: string
}

interface PublisherDict {
  ticketCreatedPub: pubs.TicketCreatedPublisher
  ticketUpdatedPub: pubs.TicketUpdatedPublisher
}

export class Stan {
  private connection?: nodeStan.Stan
  private pubs?: PublisherDict

  connect(options: Options): Promise<nodeStan.Stan> {
    const { clientId, clusterId, url } = options
    this.connection = nodeStan.connect(clusterId, clientId, { url })

    return new Promise((resolve, reject) => {
      this.connection?.on('connect', () => {
        /* eslint-disable */
        console.log('Connected to STAN server')
        return resolve(this.connection)
      })

      this.connection?.on('error', (err) => {
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

  getPubs(): PublisherDict {
    if (!this.pubs) {
      this.initPubs()
    }

    return this.pubs!
  }

  private initPubs(): void {
    const connection = this.getConnection()

    this.pubs = {
      ticketCreatedPub: new pubs.TicketCreatedPublisher(connection),
      ticketUpdatedPub: new pubs.TicketUpdatedPublisher(connection)
    }
  }
}

export const stan = new Stan()
