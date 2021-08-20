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

import { Dimensions } from 'react-native'
import { AppConfig } from './types/index'

const globalAny: any = global
const defaultWidth = 750
const defaultRadio = {
  640: 2.34 / 2,
  750: 1,
  828: 1.81 / 2
}

export function pxTransform (size: number): number {
  const deviceWidthDp = Dimensions.get('window').width
  const uiWidthPx = 375
  const config: AppConfig = globalAny.__taroAppConfig?.appConfig || {}
  const { designWidth = defaultWidth, deviceRatio = defaultRadio } = config
  if (!(designWidth in deviceRatio)) {
    throw new Error(`deviceRatio 配置中不存在 ${designWidth} 的设置！`)
  }
  const formatSize = parseInt(size + '', 10)
  const rateSize = formatSize / (deviceRatio[designWidth] * 2)
  return rateSize * deviceWidthDp / uiWidthPx
}
