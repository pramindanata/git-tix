import type { ObjectID } from 'mongodb'
import type { TicketCreatedEventData } from '@teh-tix/common/pubsub'
import { TicketDocument } from '../models/ticket'

export class TicketCreatedEventDTO implements TicketCreatedEventData {
  id: string
  title: string
  price: number
  userId: string
  createdAt: string
  version: number

  constructor(props: TicketDocument) {
    this.id = (props._id as ObjectID).toHexString()
    this.title = props.title
    this.price = props.price
    this.userId = props.userId
    this.createdAt = props.createdAt.toISOString()
    this.version = props.version
  }
}
