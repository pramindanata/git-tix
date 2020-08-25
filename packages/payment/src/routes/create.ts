import { Router } from 'express'
import { body } from 'express-validator'
import type { Request, Response } from 'express'
import { auth, validateRequestPayload } from '@teh-tix/common/middleware'
import { ActionFailError, ActionFailType } from '@teh-tix/common/exception'
import { OrderStatus } from '@teh-tix/common/constant'
import { Order } from '../models/order'
import { Payment } from '../models/payment'
import { RO, RP } from '../interface'
import { stripe } from '../lib/stripe'
import { stan } from '../lib/stan'
import { PaymentDTO, PaymentCreatedEventDTO } from '../dto'

const router = Router()

router.post(
  '/',
  auth(),
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequestPayload(),
  async (
    req: Request<any, any, RP.CreateChargeBody>,
    res: Response<RO.Item<PaymentDTO>>,
  ) => {
    const user = req.ctx.authUser!
    const { orderId, token } = req.body
    const order = await Order.findById(orderId)

    if (!order) {
      throw new ActionFailError(ActionFailType.ORDER_NOT_FOUND)
    }

    if (order.userId !== user.id) {
      throw new ActionFailError(ActionFailType.FORBIDDEN)
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new ActionFailError(ActionFailType.PAY_CANCELLED_ORDER)
    }

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    })

    const payment = Payment.build({
      orderId: order.id,
      stripeChargeId: charge.id,
    })

    await payment.save()

    const paymentDTO = new PaymentDTO(payment)
    const paymentCreatedEventDTO = new PaymentCreatedEventDTO(payment)

    await stan.getPubs().paymentCreatedPub.publish(paymentCreatedEventDTO)

    return res.json({
      data: paymentDTO,
    })
  },
)

export { router as createChargeRouter }
