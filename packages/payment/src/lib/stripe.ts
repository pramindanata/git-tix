import Stripe from 'stripe'
import { config } from '../config'

const stripe = new Stripe(config.stripe.secret!, {
  apiVersion: '2020-03-02',
})

export { stripe }
