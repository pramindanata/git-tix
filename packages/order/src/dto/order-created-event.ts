import { OrderStatus } from '@teh-tix/common/constant'
import type { ObjectID } from 'mongodb'
import type { OrderCreatedEventData } from '@teh-tix/common/pubsub'
import { OrderDocument } from '../models/order'

export class OrderCreatedEventDTO implements OrderCreatedEventData {
  id: string
  status: OrderStatus
  userId: string
  expiredAt: string
  version: number
  ticket: {
    id: string
    price: number
  }

  constructor(props: OrderDocument) {
    this.id = (props._id as ObjectID).toHexString()
    this.status = props.status
    this.expiredAt = props.expiredAt.toISOString()
    this.userId = props.userId
    this.version = props.version
    this.ticket = {
      id: props.ticket.id,
      price: props.ticket.price,
    }
  }
}
