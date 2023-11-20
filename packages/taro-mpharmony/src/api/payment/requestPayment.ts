import Taro from '@tarojs/taro'

/**
 * 发送微信支付
 * 
 * @canUse requestPayment
 * @null_implementation
 */
export const requestPayment: typeof Taro.requestPayment = function (option) {
  const name = 'requestPayment'
  return new Promise<TaroGeneral.CallbackResult>(() => {
    try {
      option?.fail?.({ errMsg: `${name}:fail` })
    } finally {
      option?.complete?.({ errMsg: `ok` })
    }
  })
}
