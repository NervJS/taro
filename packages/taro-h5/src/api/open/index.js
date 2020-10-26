import { processOpenapi } from '../utils'

export const requestPayment = processOpenapi('chooseWXPay', undefined, undefined, options => {
  return Object.assign(options, { timestamp: Number.parseInt(options.timeStamp, 10) })
})
