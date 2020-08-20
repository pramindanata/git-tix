import { config } from './config'

export const generateOrderExpirationDate = (): Date => {
  const expirationDate = new Date()
  const { expirationDurationMinute } = config.domain.order

  expirationDate.setMinutes(
    expirationDate.getMinutes() + expirationDurationMinute,
  )

  return expirationDate
}
