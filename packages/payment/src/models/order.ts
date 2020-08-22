import { model, Schema } from 'mongoose'
import { OrderStatus } from '@teh-tix/common/constant'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import type { Document, Model } from 'mongoose'

export interface OrderWriteAttrs {
  id?: string
  status: OrderStatus
  userId: string
  price: number
  version: number
}

export interface OrderDocument extends Document {
  status: OrderStatus
  userId: string
  price: number
  version: number
  createdAt: Date
  updatedAt: Date
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
    price: {
      type: Number,
      required: true,
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
