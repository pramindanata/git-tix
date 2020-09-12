import { ActionFailType, ActionFailBody } from '@teh-tix/common/exception'
import { OrderStatus } from '@teh-tix/common/constant'
import {
  createAuthCookie,
  generateMongooseId,
  doCreatePaymentReq,
} from '../../test/util'
import { Order } from '../../models/order'
import { Payment } from '../../models/payment'
import { stripe } from '../../lib/stripe'

describe('# POST /', () => {
  it('returns 403 when purchasing order does not found', async () => {
    const authCookie = createAuthCookie()
    const orderId = generateMongooseId()
    const response = await doCreatePaymentReq<ActionFailBody>(authCookie, {
      orderId,
      token: 'token',
    })

    expect(response.status).toEqual(403)
    expect(response.body.type).toEqual(ActionFailType.ORDER_NOT_FOUND)
  })

  it('return 403 when purchasing an order that does not belong to the user', async () => {
    const order = Order.build({
      id: generateMongooseId(),
      price: 20,
      status: OrderStatus.CREATED,
      userId: 'user-a',
      version: 0,
    })

    await order.save()

    const authCookie = createAuthCookie()
    const response = await doCreatePaymentReq<ActionFailBody>(authCookie, {
      token: 'string',
      orderId: order.id,
    })

    expect(response.status).toEqual(403)
    expect(response.body.type).toEqual(ActionFailType.FORBIDDEN)
  })

  it('return 403 when purchasing a cancelled order', async () => {
    const userId = 'user'
    const orderId = generateMongooseId()
    const authCookie = createAuthCookie(userId)
    const order = Order.build({
      price: 20,
      status: OrderStatus.CANCELLED,
      userId,
      version: 1,
      id: orderId,
    })

    await order.save()

    const response = await doCreatePaymentReq<ActionFailBody>(authCookie, {
      token: 'string',
      orderId: order.id,
    })

    expect(response.status).toEqual(403)
    expect(response.body.type).toEqual(ActionFailType.PAY_CANCELLED_ORDER)
  })

  it('returns 403 when purchasing paid order', async () => {
    jest.spyOn(Payment.prototype, 'save')
    jest.spyOn(stripe.charges, 'create')

    const orderId = generateMongooseId()
    const authCookie = createAuthCookie('user')
    const order = Order.build({
      price: 25,
      status: OrderStatus.CREATED,
      userId: 'user',
      version: 1,
      id: orderId,
    })
    const payment = Payment.build({
      orderId: order.id,
      stripeChargeId: 'test',
    })
    const reqBody = {
      token: 'tok_visa',
      orderId: order.id,
    }

    await order.save()
    await payment.save()

    const response = await doCreatePaymentReq<ActionFailBody>(
      authCookie,
      reqBody,
    )

    const payments = await Payment.find({
      orderId: reqBody.orderId,
    })

    expect(response.status).toEqual(403)
    expect(response.body.type).toEqual(ActionFailType.ORDER_ALREADY_PAID)
    expect(stripe.charges.create).not.toHaveBeenCalled()
    expect(payments.length).toEqual(1)
  })

  it('returns 200 with valid input', async () => {
    jest.spyOn(stripe.charges, 'create')

    const orderId = generateMongooseId()
    const authCookie = createAuthCookie('user')
    const order = Order.build({
      price: 25,
      status: OrderStatus.CREATED,
      userId: 'user',
      version: 1,
      id: orderId,
    })
    const reqBody = {
      token: 'tok_visa',
      orderId: order.id,
    }

    await order.save()

    const response = await doCreatePaymentReq(authCookie, reqBody)
    const createdPayment = await Payment.findOne({
      orderId: reqBody.orderId,
    })

    expect(response.status).toEqual(200)
    expect(stripe.charges.create).toBeCalledWith({
      currency: 'usd',
      amount: order.price * 100,
      source: reqBody.token,
    })
    expect(createdPayment).not.toBeNull()
  })
})
