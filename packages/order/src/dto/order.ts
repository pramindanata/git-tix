import { OrderStatus } from '@teh-tix/common/constant'
import type { ObjectID } from 'mongodb'
import { TicketDTO } from './ticket'
import { OrderDocument } from '../models/order'
import type { DTO } from '../interface'

/**
 * General purpose Order DTO
 */
export class OrderDTO implements DTO.WithCreatedAt {
  id: string
  status: OrderStatus
  expiredAt: string
  ticket: TicketDTO
  createdAt: string

  constructor(props: OrderDocument) {
    this.id = (props._id as ObjectID).toHexString()
    this.status = props.status
    this.expiredAt = props.expiredAt.toISOString()
    this.ticket = new TicketDTO(props.ticket)
    this.createdAt = props.createdAt.toISOString()
  }
}
