import { temporarilyNotSupport } from '../../utils'

// 订阅消息
// null-implementation
export const requestSubscribeMessage = () =>
  Promise.resolve({
    errMsg: 'requestSubscribeMessage:ok',
  })
// 订阅设备消息
export const requestSubscribeDeviceMessage = /* @__PURE__ */ temporarilyNotSupport('requestSubscribeDeviceMessage')
