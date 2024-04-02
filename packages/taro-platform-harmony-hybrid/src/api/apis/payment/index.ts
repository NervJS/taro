export * from './requestPayment'

/**
 * 创建自定义版交易组件订单，并发起支付
 * 
 * @canNotUse requestOrderPayment
 */
export { requestOrderPayment } from '@tarojs/taro-h5'

/**
 * 支付各个安全场景验证人脸
 * 
 * @canNotUse faceVerifyForPay
 */
export { faceVerifyForPay } from '@tarojs/taro-h5'