import { temporarilyNotSupport } from '../../utils'

export * from './requestPayment'

/**
 * 创建自定义版交易组件订单，并发起支付
 * 
 * @canNotUse requestOrderPayment
 */
export const requestOrderPayment = /* @__PURE__ */ temporarilyNotSupport('requestOrderPayment')

/**
 * 支付各个安全场景验证人脸
 * 
 * @canNotUse faceVerifyForPay
 */
export const faceVerifyForPay = /* @__PURE__ */ temporarilyNotSupport('faceVerifyForPay')