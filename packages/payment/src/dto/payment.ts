import type { ObjectID } from 'mongodb'
import { PaymentDocument } from '../models/payment'
import type { DTO } from '../interface'

/**
 * General purpose Order DTO
 */
export class PaymentDTO implements DTO.WithCreatedAt {
  id: string
  orderId: string
  stripeChargeId: string
  createdAt: string

  constructor(props: PaymentDocument) {
    this.id = (props._id as ObjectID).toHexString()
    this.orderId = props.orderId
    this.stripeChargeId = props.stripeChargeId
    this.createdAt = props.createdAt.toISOString()
  }
}
