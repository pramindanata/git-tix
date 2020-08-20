import type { ObjectID } from 'mongodb'
import type { TicketUpdatedEventData } from '@teh-tix/common/pubsub'
import { TicketDocument } from '../models/ticket'

export class TicketUpdatedEventDTO implements TicketUpdatedEventData {
  id: string
  title: string
  price: number
  userId: string
  createdAt: string
  version: number
  orderId: string | null

  constructor(props: TicketDocument) {
    this.id = (props._id as ObjectID).toHexString()
    this.title = props.title
    this.price = props.price
    this.userId = props.userId
    this.createdAt = props.createdAt.toISOString()
    this.version = props.version
    this.orderId = props.orderId
  }
}
