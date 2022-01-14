import Taro from '@tarojs/api'

import { MethodHandler } from '../../utils/handler'
import { temporarilyNotSupport } from '../../utils'

function getConnection () {
  // @ts-ignore
  return navigator.connection || navigator.mozConnection || navigator.webkitConnection || navigator.msConnection
}

export const getNetworkType: typeof Taro.getNetworkType = (options = {}) => {
  const connection = getConnection()
  const { success, fail, complete } = options
  const handle = new MethodHandler<Taro.getNetworkType.SuccessCallbackResult>({ name: 'getNetworkType', success, fail, complete })

  let networkType: keyof Taro.getNetworkType.networkType = 'unknown'
  // 浏览器不支持获取网络状态
  if (!connection) {
    return handle.success({ networkType })
  }

  // Supports only the navigator.connection.type value which doesn't match the latest spec.
  // https://www.davidbcalhoun.com/2010/using-navigator-connection-android/
  if (!isNaN(Number(connection.type))) {
    switch (connection.type) {
      // @ts-ignore
      case connection.WIFI:
        networkType = 'wifi'
        break
      // @ts-ignore
      case connection.CELL_3G:
        networkType = '3g'
        break
      // @ts-ignore
      case connection.CELL_2G:
        networkType = '2g'
        break
      default:
        // ETHERNET, UNKNOWN
        networkType = 'unknown'
    }
  } else if (connection.type) {
    // @ts-ignore
    networkType = connection.type // Only supports the type value.
    // @ts-ignore
  } else if (connection.effectiveType) {
    // @ts-ignore
    networkType = connection.effectiveType
  }

  return handle.success({ networkType })
}

export const onNetworkStatusChange: typeof Taro.onNetworkStatusChange = (cb) => {
  const connection = getConnection()
  if (connection) {
    connection.addEventListener('change', function () {
      getNetworkType()
        .then(res => {
          const { networkType } = res
          const isConnected = networkType !== 'none'
          const obj = { isConnected, networkType }
          cb(obj)
        })
    })
  }
}

export const offNetworkStatusChange = temporarilyNotSupport('offNetworkStatusChange')
export const getLocalIPAddress = temporarilyNotSupport('getLocalIPAddress')
