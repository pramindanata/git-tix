import { model, Schema } from 'mongoose'
import type { Document, Model } from 'mongoose'

export interface TicketWriteAttrs {
  title: string
  price: number
  userId: string
}

export interface TicketDocument extends Document, TicketWriteAttrs {
  title: string
  price: number
  userId: string
  createdAt: number
  updatedAt: number
  set(path: string, val: any, options?: any): this
  set(path: string, val: any, type: any, options?: any): this
  set(value: Partial<TicketWriteAttrs>): this
}

export interface ExtendedTicketModel extends Model<TicketDocument> {
  build(attrs: TicketWriteAttrs): TicketDocument
}

const schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

schema.statics.build = (attrs: TicketWriteAttrs): TicketDocument => {
  return new Ticket(attrs)
}

export const Ticket = model<TicketDocument, ExtendedTicketModel>(
  'Ticket',
  schema,
)
