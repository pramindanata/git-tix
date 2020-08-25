import type { ObjectID } from 'mongodb'
import type { PaymentCreatedEventData } from '@teh-tix/common/pubsub'
import { PaymentDocument } from '../models/payment'

export class PaymentCreatedEventDTO implements PaymentCreatedEventData {
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
