/*
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

function getConnection () {
  return navigator.connection || navigator.mozConnection || navigator.webkitConnection || navigator.msConnection
}

function getNetworkType (options = {}) {
  const connection = getConnection()
  const { success, complete } = options
  const res = {
    errMsg: 'getNetworkType:ok'
  }

  // 浏览器不支持获取网络状态
  if (!connection) {
    res.networkType = 'unknown'
    typeof success === 'function' && success(res)
    typeof complete === 'function' && complete(res)
    return Promise.resolve(res)
  }

  let type = 'unknown'

  // Supports only the navigator.connection.type value which doesn't match the latest spec.
  // https://www.davidbcalhoun.com/2010/using-navigator-connection-android/
  if (!isNaN(Number(connection.type))) {
    switch (connection.type) {
      case connection.WIFI:
        type = 'wifi'
        break
      case connection.CELL_3G:
        type = '3g'
        break
      case connection.CELL_2G:
        type = '2g'
        break
      default:
        // ETHERNET, UNKNOWN
        type = 'unknown'
    }
  } else if (connection.type) {
    // Only supports the type value.
    type = connection.type
  } else if (connection.effectiveType) {
    //  effectiveType
    type = connection.effectiveType
  }

  res.networkType = type
  typeof success === 'function' && success(res)
  typeof complete === 'function' && complete(res)
  return Promise.resolve(res)
}

function onNetworkStatusChange (cb) {
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

export { getNetworkType, onNetworkStatusChange }
