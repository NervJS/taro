import Taro from '@tarojs/taro'

import native from '../NativeApi'

/**
 * 请求订阅消息
 *
 * @canUse requestSubscribeMessage
 * @__object [tmplIds]
 * @__success [errMsg, TEMPLATE_ID]
 */
export const requestSubscribeMessage = (options) => {
  try {
    native.requestSubscribeMessage(options)
  } catch (res) {
    const result: Taro.requestSubscribeMessage.FailCallbackResult = {
      errCode: 500,
      errMsg: JSON.stringify(res),
    }
    options.fail?.(result)
    options.complete?.(result)
  }
}

/**
 * 订阅设备消息接口，调用后弹出授权框，用户同意后会允许开发者给用户发送订阅模版消息
 *
 * @canNotUse requestSubscribeDeviceMessage
 */
export { requestSubscribeDeviceMessage } from '@tarojs/taro-h5'
