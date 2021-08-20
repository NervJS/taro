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

import { Linking } from 'react-native'

export async function openUrl <T>(opts: Taro.OpenUrl.Option): Promise<T> {
  const { url, success, fail, complete } = opts || {} as Taro.OpenUrl.Option
  const res: any = { errMsg: 'openUrl:ok' }

  const isSupport = await Linking.canOpenURL(url)
  if (isSupport) {
    await Linking.openURL(url)
    success && success(res)
    complete && complete(res)

    return Promise.resolve(res)
  } else {
    res.errMsg = 'openUrl:fail. Do not support the openUrl Api'
    fail && fail(res)
    complete && complete(res)

    return Promise.reject(res)
  }
}

export default {
  openUrl
}
