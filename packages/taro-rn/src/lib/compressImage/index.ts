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

import ImageResizer from 'react-native-image-resizer'

/**
 * 压缩图片
 * @param opts
 */
export function compressImage(opt: Taro.compressImage.Option): Promise<Taro.compressImage.SuccessCallbackResult> {
  const {
    src,
    quality = 80,
    success,
    fail,
    complete
  } = opt

  const res = { errMsg: 'compressImage:ok', tempFilePath: '' }

  return new Promise((resolve, reject) => {
    return ImageResizer.createResizedImage(src, 800, 800, 'JPEG', quality, 0, '')
      .then((resp: any) => {
        res.tempFilePath = resp.uri
        success?.(res)
        complete?.(res)

        resolve(res)
      }).catch((err) => {
        res.errMsg = err
        fail?.(res)
        complete?.(res)

        reject(err)
      })
  })
}
