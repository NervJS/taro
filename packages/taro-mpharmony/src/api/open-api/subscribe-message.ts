import Taro from '@tarojs/taro'

/**
 * 请求订阅消息
 * 
 * @canUse requestSubscribeMessage
 * @__object [tmplIds]
 * @__success [errMsg, TEMPLATE_ID]
 */
export const requestSubscribeMessage = (options) => {
  const tmplIds = options.tmplIds
  try {
    // @ts-ignore
    native.requestSubscribeMessage(options).then((res) => {
      if (res.errMsg === 'success') {
        const tmpItem = {}
        tmplIds.forEach(item => {
          tmpItem[item] = 'accept'
        })
        const result:Taro.requestSubscribeMessage.SuccessCallbackResult = {
          errMsg: 'requestSubscribeMessage: ok',
          ...tmpItem
        }
        options.success?.(result)
        options.complete?.(result)
      } else {
        const result:Taro.requestSubscribeMessage.FailCallbackResult = {
          ...res
        }
        options.fail?.(result)  
        options.complete?.(result)
      }
    })
  } catch (res) {
    const result:Taro.requestSubscribeMessage.FailCallbackResult = {
      errCode: 500,
      errMsg: JSON.stringify(res)
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