import connection from '@ohos.net.connection'

import { CallbackManager, MethodHandler, temporarilyNotSupport } from '../utils'

import type Taro from '@tarojs/taro/types'

const netCon = connection.createNetConnection()

function getNetworkValue () {
  let networkType = 'unknown'
  let metered = false
  const netHandle = connection.getDefaultNetSync()
  const getNetCapabilitiesSync = connection.getNetCapabilitiesSync(netHandle)
  if (getNetCapabilitiesSync) {
    const { networkCap = [], bearerTypes = [] } = getNetCapabilitiesSync

    switch (bearerTypes[0]) {
      case connection.NetBearType.BEARER_CELLULAR:
        networkType = '4g'
        break
      case connection.NetBearType.BEARER_WIFI:
        networkType = 'WiFi'
        break
      case connection.NetBearType.BEARER_ETHERNET:
        networkType = '4g'
        break
      case connection.NetBearType.BEARER_VPN:
        networkType = 'VPN'
        break
      default:
        networkType = 'unknown'
        break
    }
    metered = !networkCap.find(item => item === connection.NetCap.NET_CAPABILITY_NOT_METERED)
  }

  return { networkType, metered }
}

export const getNetworkType: typeof Taro.getNetworkType = (options = {}) => {
  const { success, fail, complete } = options
  const handle = new MethodHandler<Taro.getNetworkType.SuccessCallbackResult & { code: unknown, metered: boolean }>({ name: 'getNetworkType', success, fail, complete })

  return new Promise((resolve, reject) => {
    connection.getDefaultNet().then((netHandle) => {
      let networkType: any = 'none'
      let metered = false
      if (netHandle.netId !== 0) {
        const res = getNetworkValue()
        networkType = res.networkType
        metered = res.metered
      }

      return handle.success({
        networkType: networkType || 'unknown',
        metered: metered
      }, { resolve, reject })
    }).catch((error) => {
      return handle.fail({
        errMsg: error || '',
        code: -1
      }, { resolve, reject })
    })
  })
}

const networkStatusManager = new CallbackManager()

const networkStatusListener = (error: any) => {
  if (error) {
    return networkStatusManager.trigger({ isConnected: false, networkType: 'none' })
  }
  const res = getNetworkValue()
  const networkType = res.networkType || 'unknown'
  const isConnected = networkType !== 'none'
  const metered = res.metered
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
      netCon.register(networkStatusListener)
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
      netCon.unregister(networkStatusListener)
    }
  } catch (error) {
    handle.fail({
      errMsg: error
    })
  }
}

export const getLocalIPAddress = /* @__PURE__ */ temporarilyNotSupport('getLocalIPAddress')
