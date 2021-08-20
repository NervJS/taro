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

import AsyncStorage from '@react-native-async-storage/async-storage'

async function getStorageCurrentSize() {
  const keys = await AsyncStorage.getAllKeys()
  const mults = await AsyncStorage.multiGet(keys)
  const size = mults.reduce((prev, current) => {
    const sum = prev + (current && current[1] ? current[1].length : 0)
    return sum
  }, 0)
  return Number((size / 1024).toFixed(2))
}

export function getStorageInfo(option: Taro.getStorageInfo.Option = {}): Promise<Taro.General.CallbackResult> {
  const { success, fail, complete } = option
  const res = { errMsg: 'getStorageInfo:ok' }

  return new Promise((resolve, reject) => {
    AsyncStorage.getAllKeys()
      .then(async (data) => {
        const result = {
          ...res,
          keys: data,
          currentSize: await getStorageCurrentSize(),
          limitSize: Infinity
        }
        success && success(result)
        complete && complete(result)

        resolve(result)
      }).catch((err) => {
        res.errMsg = err.message
        fail && fail(res)
        complete && complete(res)

        reject(err)
      })
  })
}
