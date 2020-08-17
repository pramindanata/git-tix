import { model, Schema } from 'mongoose'
import type { Document, Model } from 'mongoose'

export interface TicketWriteAttrs {
  id?: any
  title: string
  price: number
}

export interface TicketDocument extends Document, TicketWriteAttrs {
  createdAt: Date
  updatedAt: Date
  set(path: string, val: any, options?: any): this
  set(path: string, val: any, type: any, options?: any): this
  set(value: Partial<TicketWriteAttrs>): this
  isReserved(): Promise<boolean>
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
      min: 0,
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
