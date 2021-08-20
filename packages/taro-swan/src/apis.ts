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

import { processApis } from '@tarojs/shared'
import { needPromiseApis } from './apis-list'

declare const swan: any

const apiDiff = {
  login: {
    alias: 'getLoginCode'
  }
}

export function transformMeta (api: string, options: Record<string, any>) {
  let apiAlias = api
  Object.keys(apiDiff).forEach(item => {
    const apiItem = apiDiff[item]
    if (api === item) {
      if (apiItem.alias) {
        apiAlias = apiItem.alias
      }
      if (apiItem.options) {
        const change = apiItem.options.change
        const set = apiItem.options.set
        if (change) {
          change.forEach(changeItem => {
            options[changeItem.new] = options[changeItem.old]
          })
        }
        if (set) {
          set.forEach(setItem => {
            options[setItem.key] = typeof setItem.value === 'function' ? setItem.value(options) : setItem.value
          })
        }
      }
    }
  })

  return {
    key: apiAlias,
    options
  }
}

export function initNativeApi (taro) {
  processApis(taro, swan, {
    needPromiseApis,
    transformMeta
  })
}
