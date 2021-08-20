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

/**
 * ✔ type
 * ✔ size
 * ✔ color
 */

import * as React from 'react'
import {
  View,
  Image
} from 'react-native'
import * as WEUI from '../../assets/weui'
import { IconProps } from './PropsType'

interface UIType {
  [key: string]: any;
}

const iconTypeMap: { [key: string]: string } = {
  success: 'SUCCESS',
  success_no_circle: 'SUCCESS_NO_CIRCLE',
  info: 'INFO',
  warn: 'WARN',
  waiting: 'WAITING',
  cancel: 'CANCEL',
  download: 'DOWNLOAD',
  search: 'SEARCH',
  clear: 'CLEAR',
}

const _Icon: React.FC<IconProps> = ({
  style,
  type,
  size = 23,
  color
}: IconProps) => {
  size = ~~size

  const iconObj: any = (WEUI as UIType)[iconTypeMap[type]]

  if (!iconObj) {
    return (
      <View style={[style, { width: size, height: size }]} />
    )
  }

  const imageAsset: any = iconObj.image
  // @todo Back & Delete do not have default color. '#B2B2B2'
  const iconColor: string = color || iconObj.defaultColor

  return (
    <View style={[style, { width: size, height: size }]}>
      <Image
        source={imageAsset}
        style={{
          width: size,
          height: size,
          tintColor: iconColor
        }}
      />
    </View>
  )
}

_Icon.displayName = '_Icon'

export default _Icon
