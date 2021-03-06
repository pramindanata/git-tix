import { model, Schema } from 'mongoose'
import { OrderStatus } from '@teh-tix/common/constant'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import type { Document, Model } from 'mongoose'
import type { TicketDocument } from './ticket'

export interface OrderWriteAttrs {
  status: OrderStatus
  userId: string
  expiredAt: Date
  ticket?: TicketDocument
}

export interface OrderDocument extends Document {
  status: OrderStatus
  userId: string
  expiredAt: Date
  version: number
  createdAt: Date
  updatedAt: Date
  ticket: TicketDocument
  set(path: string, val: any, options?: any): this
  set(path: string, val: any, type: any, options?: any): this
  set(value: Partial<OrderWriteAttrs>): this
}

export interface ExtendedOrderModel extends Model<OrderDocument> {
  build(attrs: OrderWriteAttrs): OrderDocument
}

const schema = new Schema(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.CREATED,
    },
    userId: {
      type: String,
      required: true,
    },
    expiredAt: {
      type: Schema.Types.Date,
    },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    timestamps: true,
  },
)

schema.set('versionKey', 'version')
schema.plugin(updateIfCurrentPlugin)

schema.statics.build = (attrs: OrderWriteAttrs): OrderDocument => {
  return new Order(attrs)
}

export const Order = model<OrderDocument, ExtendedOrderModel>('Order', schema)
