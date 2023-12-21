// 网络状态，从API Version 7 开始，该接口不再维护，推荐使用新接口'@ohos.telephony.observer'
// 但是新接口 @ohos.telephony.observer 没有network.getType。而且网络状态枚举值不清楚
import network from '@system.network'

import { temporarilyNotSupport } from '../utils'
import { CallbackManager, MethodHandler } from '../utils/handler'

import type Taro from '@tarojs/taro/types'

export const getNetworkType: typeof Taro.getNetworkType = (options = {}) => {
  const { success, fail, complete } = options
  const handle = new MethodHandler<Taro.getNetworkType.SuccessCallbackResult & { code: unknown, metered: boolean }>({ name: 'getNetworkType', success, fail, complete })

  return new Promise((resolve, reject) => {
    network.getType({
      success: function (data) {
        return handle.success({
          networkType: data.type || 'unknown',
          metered: data.metered
        }, { resolve, reject })
      },
      fail: function (data, code) {
        return handle.fail({
          errMsg: data || '',
          code
        }, { resolve, reject })
      },
    })
  })
}

const networkStatusManager = new CallbackManager()

const networkStatusListener = async (data, code = 0) => {
  if (code > 0) {
    return networkStatusManager.trigger({ isConnected: false, networkType: 'none' })
  }
  const networkType = data.type || 'unknown'
  const isConnected = networkType !== 'none'
  const metered = !!data.metered
  const obj = { isConnected, networkType, metered }
  networkStatusManager.trigger(obj)
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
    networkStatusManager.add(callback)
    if (networkStatusManager.count() === 1) {
      network.subscribe({
        success: networkStatusListener,
        fail: networkStatusListener,
      })
    }
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
    networkStatusManager.remove(callback)
    if (networkStatusManager.count() === 0) {
      network.unsubscribe()
    }
  } catch (error) {
    handle.fail({
      errMsg: error
    })
  }
}

export const getLocalIPAddress = /* @__PURE__ */ temporarilyNotSupport('getLocalIPAddress')
