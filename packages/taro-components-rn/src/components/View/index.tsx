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
 * ✔ hoverStyle (hover-class)
 * ✘ hover-stop-propagation
 * ✔ hoverStartTime
 * ✔ hoverStayTime
 */

import * as React from 'react'
import {
  View,
  Text,
} from 'react-native'
import ClickableSimplified from '../ClickableSimplified'
import { _ViewProps } from './PropsType'

const stringToText = (child: any, props: any) => {
  // TODO: 实现小程序中效果
  return (typeof child === 'string' || typeof child === 'number') ? <Text {...props}>{child}</Text> : child
}

const _View: React.FC<_ViewProps> = (props: _ViewProps) => {
  // 兼容View中没用Text包裹的文字 防止报错 直接继承props在安卓中文字会消失？？？
  const child = Array.isArray(props.children) ? props.children.map((c: any, i: number) => stringToText(c, { key: i, ...props, style: {} })) : stringToText(props.children, { ...props, style: {} })
  return (
    <View
      style={props.style}
      {...props}
    >
      {child}
    </View>
  )
}

_View.displayName = '_View'

export { _View }
export default ClickableSimplified(_View)
