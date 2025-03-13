import { MethodHandler, temporarilyNotSupport } from '../utils'

import type Taro from '@tarojs/taro/types'

export const getNetworkType: typeof Taro.getNetworkType = (options = {}) => {
  const { success, fail, complete } = options
  const handle = new MethodHandler<Taro.getNetworkType.SuccessCallbackResult & { code: unknown, metered: boolean }>({ name: 'getNetworkType', success, fail, complete })

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const data = await get('NetworkManager').getNetworkType()

      return handle.success(data, {
        resolve,
        reject
      })
    } catch (error) {
      handle.fail({
        errMsg: error || '',
        code: -1
      }, { resolve, reject })
    }
  })
}

/**
 * 在最近的八次网络请求中, 出现下列三个现象之一则判定弱网。
 * - 出现三次以上连接超时
 * - 出现三次 rtt 超过 400
 * - 出现三次以上的丢包
 * > 弱网事件通知规则是: 弱网状态变化时立即通知, 状态不变时 30s 内最多通知一次。
 */
export const onNetworkWeakChange = /* @__PURE__ */ temporarilyNotSupport('onNetworkWeakChange')

export const onNetworkStatusChange: typeof Taro.onNetworkStatusChange = callback => {
  const name = 'onNetworkStatusChange'
  const handle = new MethodHandler<Partial<Taro.onNetworkStatusChange.CallbackResult>>({ name, complete: callback })
  try {
    get('NetworkManager').onNetworkStatusChange(callback)
  } catch (error) {
    handle.fail({
      errMsg: error
    })
  }
}

export const offNetworkWeakChange = /* @__PURE__ */ temporarilyNotSupport('offNetworkWeakChange')

export const offNetworkStatusChange: typeof Taro.offNetworkStatusChange = callback => {
  const name = 'offNetworkStatusChange'
  const handle = new MethodHandler<Partial<Taro.onNetworkStatusChange.CallbackResult>>({ name, complete: callback })
  try {
    get('NetworkManager').offNetworkStatusChange(callback)
  } catch (error) {
    handle.fail({
      errMsg: error
    })
  }
}

export const getLocalIPAddress = /* @__PURE__ */ temporarilyNotSupport('getLocalIPAddress')
