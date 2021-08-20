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

import { Image } from 'react-native'

export function getImageInfo(option: Taro.getImageInfo.Option): Promise<Taro.getImageInfo.SuccessCallbackResult> {
  const { src, success, fail, complete } = option

  return new Promise((resolve, reject) => {
    Image.getSize(
      src,
      (width, height) => {
        const orientation: keyof Taro.getImageInfo.orientation = 'up'
        const res = {
          width,
          height,
          path: src,
          orientation, // todo
          type: '', // todo
          errMsg: 'getImageInfo: ok'
        }
        success?.(res)
        complete?.(res)
        resolve(res)
      },
      (err) => {
        const res = {
          errMsg: err.message,
        }
        fail?.(res)
        complete?.(res)
        reject(res)
      }
    )
  })
}
