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

import { Vibration } from 'react-native'

function vibrate (DURATION, API, OPTS): Promise<Taro.General.CallbackResult> {
  const res = { errMsg: `${API}:ok` }
  return new Promise((resolve, reject) => {
    const { success, fail, complete } = OPTS
    try {
      Vibration.vibrate(DURATION)
      success && success(res)
      complete && complete(res)

      resolve(res)
    } catch (err) {
      res.errMsg = err.message
      fail && fail(res)
      complete && complete(res)

      reject(res)
    }
  })
}

function vibrateShort (opts: Taro.vibrateShort.Option = {}): Promise<Taro.General.CallbackResult> {
  return vibrate(15, 'vibrateShort', opts)
}

function vibrateLong (opts: Taro.vibrateLong.Option = {}): Promise<Taro.General.CallbackResult> {
  return vibrate(400, 'vibrateLong', opts)
}

export {
  vibrateShort,
  vibrateLong
}
