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

import Clipboard from '@react-native-community/clipboard'
import { showToast } from '../showModal/toast'

export function setClipboardData(opts: Taro.setClipboardData.Option): Promise<Taro.setClipboardData.Promised> {
  const { data, success, fail, complete } = opts

  if (typeof data !== 'string') {
    const res = {
      errMsg: 'setClipboardData:fail parameter error: parameter.data should be String'
    }
    fail?.(res)
    complete?.(res)

    return Promise.reject(res)
  }

  Clipboard.setString(data)
  const res = {
    errMsg: 'setClipboardData:ok',
    data,
  }
  showToast({
    title: '内容已复制'
  })
  success?.(res)
  complete?.(res)

  return Promise.resolve(res)
}
