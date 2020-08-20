import type { ObjectID } from 'mongodb'
import { TicketDocument } from '../models/ticket'

/**
 * General purpose Ticket DTO
 */
export class TicketDTO {
  id: string
  title: string
  price: number

  constructor(props: TicketDocument) {
    this.id = (props._id as ObjectID).toHexString()
    this.title = props.title
    this.price = props.price
  }
}
