import { temporarilyNotSupport } from '../../utils'

/**
 * 请求订阅消息
 * 
 * @canUse requestSubscribeMessage
 * @null_implementation
 */
export const requestSubscribeMessage = () =>
  Promise.resolve({
    errMsg: 'requestSubscribeMessage:ok',
  })

/**
 * 订阅设备消息接口，调用后弹出授权框，用户同意后会允许开发者给用户发送订阅模版消息
 * 
 * @canNotUse requestSubscribeDeviceMessage
 */
export const requestSubscribeDeviceMessage = /* @__PURE__ */ temporarilyNotSupport('requestSubscribeDeviceMessage')
