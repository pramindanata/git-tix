import { model, Schema } from 'mongoose'
import type { Document, Model } from 'mongoose'

export interface PaymentWriteAttrs {
  orderId: string
  stripeChargeId: string
}

export interface PaymentDocument extends Document {
  orderId: string
  stripeChargeId: string
  createdAt: Date
  updatedAt: Date
  set(path: string, val: any, options?: any): this
  set(path: string, val: any, type: any, options?: any): this
  set(value: Partial<PaymentWriteAttrs>): this
}

export interface ExtendedPaymentModel extends Model<PaymentDocument> {
  build(attrs: PaymentWriteAttrs): PaymentDocument
}

const schema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeChargeId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

schema.statics.build = (attrs: PaymentWriteAttrs): PaymentDocument => {
  return new Payment(attrs)
}

export const Payment = model<PaymentDocument, ExtendedPaymentModel>(
  'Payment',
  schema,
)
