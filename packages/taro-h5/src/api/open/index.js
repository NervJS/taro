import { processApis } from '../utils'

export const requestPayment = processApis('chooseWXPay', undefined, undefined, options => {
  return Object.assign(options, { timestamp: Number.parseInt(options.timeStamp, 10) })
})
