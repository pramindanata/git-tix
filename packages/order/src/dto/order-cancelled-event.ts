import type { ObjectID } from 'mongodb'
import type { OrderCancelledEventData } from '@teh-tix/common/pubsub'
import { OrderDocument } from '../models/order'

export class OrderCancelledEventDTO implements OrderCancelledEventData {
  id: string
  version: number
  ticket: {
    id: string
  }

  constructor(props: OrderDocument) {
    this.id = (props._id as ObjectID).toHexString()
    this.version = props.version
    this.ticket = {
      id: props.ticket.id,
    }
  }
}
