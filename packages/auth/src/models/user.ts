import { model, Schema, Document, Model } from 'mongoose'
import { Password } from '../services/password'

interface UserWriteAttrs {
  email: string
  password: string
}

interface UserDocument extends Document, UserWriteAttrs {
  createdAt: string
  updatedAt: string
}

interface ExtendedUserModel extends Model<UserDocument> {
  build(attrs: UserWriteAttrs): UserDocument
}

const schema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})

schema.statics.build = (attrs: UserWriteAttrs): Document => {
  return new User(attrs)
}

schema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashedPassword = await Password.toHash(this.get('password'))

    this.set('password', hashedPassword)
  }

  done()
})

const User = model<UserDocument, ExtendedUserModel>('User', schema)

export { User, UserWriteAttrs, UserDocument }
