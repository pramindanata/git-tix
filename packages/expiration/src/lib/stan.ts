import {
  StanClient,
  Publishable,
  Subscriber,
  Event,
} from '@teh-tix/common/pubsub'
import nodeStan from 'node-nats-streaming'

export class Stan extends StanClient {}

export const stan = new Stan()
