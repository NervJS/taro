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

import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake'
import { successHandler, errorHandler } from '../../utils'

/**
 * keepScreenOn
 * @param {{}} opts
 * @param {boolean} opts.keepScreenOn - 是否保持屏幕常亮
 */
export async function setKeepScreenOn(opts: Taro.setKeepScreenOn.Option): Promise<Taro.setKeepScreenOn.Promised> {
  const res = { errMsg: 'setKeepScreenOn:ok' } as any
  const { keepScreenOn, success, fail, complete } = opts
  try {
    if (keepScreenOn) {
      activateKeepAwake()
    } else {
      deactivateKeepAwake()
    }
    return successHandler(success, complete)(res)
  } catch (e) {
    res.errMsg = `setKeepScreenOn:fail invalid ${e}`
    return errorHandler(fail, complete)(res)
  }
}
