/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import Taro from '@tarojs/api'

import { temporarilyNotSupport } from '../../utils'
import { CallbackManager, MethodHandler } from '../../utils/handler'

function getConnection () {
  // @ts-ignore
  return navigator.connection || navigator.mozConnection || navigator.webkitConnection || navigator.msConnection
}

export const getNetworkType: typeof Taro.getNetworkType = (options = {}) => {
  const connection = getConnection()
  const { success, fail, complete } = options
  const handle = new MethodHandler<Taro.getNetworkType.SuccessCallbackResult>({ name: 'getNetworkType', success, fail, complete })

  let networkType: keyof Taro.getNetworkType.NetworkType = 'unknown'
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

const networkStatusManager = new CallbackManager()

const networkStatusListener = async () => {
  const { networkType } = await getNetworkType()
  const isConnected = networkType !== 'none'
  const obj = { isConnected, networkType }
  networkStatusManager.trigger(obj)
}

/**
 * 在最近的八次网络请求中, 出现下列三个现象之一则判定弱网。
 * - 出现三次以上连接超时
 * - 出现三次 rtt 超过 400
 * - 出现三次以上的丢包
 * > 弱网事件通知规则是: 弱网状态变化时立即通知, 状态不变时 30s 内最多通知一次。
 */
export const onNetworkWeakChange = temporarilyNotSupport('onNetworkWeakChange')

export const onNetworkStatusChange: typeof Taro.onNetworkStatusChange = callback => {
  networkStatusManager.add(callback)
  const connection = getConnection()
  if (connection && networkStatusManager.count() === 1) {
    connection.addEventListener('change', networkStatusListener)
  }
}

export const offNetworkWeakChange = temporarilyNotSupport('offNetworkStatusChange')

export const offNetworkStatusChange: typeof Taro.offNetworkStatusChange = callback => {
  networkStatusManager.remove(callback)
  const connection = getConnection()
  if (connection && networkStatusManager.count() === 0) {
    connection.removeEventListener('change', networkStatusListener)
  }
}

export const getLocalIPAddress = temporarilyNotSupport('getLocalIPAddress')
