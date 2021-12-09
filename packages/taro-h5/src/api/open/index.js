import { processOpenApi } from '../utils'

export const requestPayment = processOpenApi('chooseWXPay', undefined, undefined, options => {
  return Object.assign(options, { timestamp: Number.parseInt(options.timeStamp, 10) })
})
