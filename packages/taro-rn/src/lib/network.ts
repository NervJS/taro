/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import NetInfo from '@react-native-community/netinfo'

let _unsubscribe: any = null

let _callbacks: Set<Function> = new Set()

export function getNetworkType(opts: Taro.getNetworkType.Option = {}): Promise<Taro.getNetworkType.SuccessCallbackResult> {
  const { success, fail, complete } = opts
  const res: any = {}

  return new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then((connectionInfo) => {
        res.networkType = connectionInfo.type
        res.errMsg = 'getNetworkType:ok'
        success && success(res)
        complete && complete(res)

        resolve(res)
      }).catch((err) => {
        res.errMsg = err.message
        fail && fail(res)
        complete && complete(res)

        reject(err)
      })
  })
}

export function onNetworkStatusChange(fnc: Taro.onNetworkStatusChange.Callback): void {
  _callbacks.add(fnc)
  if (!_unsubscribe) {
    _unsubscribe = NetInfo.addEventListener((connectionInfo) => {
      _callbacks.forEach(cb => {
        const { type, isConnected } = connectionInfo
        cb?.({ isConnected, networkType: type })
      })
    })
  }
}

export function offNetworkStatusChange(fnc?: Taro.onNetworkStatusChange.Callback): void {
  if (fnc && typeof fnc === 'function') {
    _callbacks.delete(fnc)
  } else if (fnc === undefined) {
    _callbacks.clear()
    _unsubscribe?.()
    _unsubscribe = null
  } else {
    console.warn('offNetworkStatusChange failed')
  }
}
