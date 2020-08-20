import type { ObjectID } from 'mongodb'
import { TicketDocument } from '../models/ticket'
import type { DTO } from '../interface'

/**
 * General purpose Ticket DTO
 */
export class TicketDTO implements DTO.WithUserId, DTO.WithCreatedAt {
  id: string
  title: string
  price: number
  userId: string
  createdAt: string

  constructor(props: TicketDocument) {
    this.id = (props._id as ObjectID).toHexString()
    this.title = props.title
    this.price = props.price
    this.userId = props.userId
    this.createdAt = props.createdAt.toISOString()
  }
}
