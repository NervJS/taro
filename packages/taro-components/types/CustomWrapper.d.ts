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

import { ComponentType } from 'react'
import { StandardProps } from './common'

interface CustomWrapperProps extends StandardProps {
}

/** custom-wrapper 自定义组件包裹器
 * 当数据更新层级较深时，可用此组件将需要更新的区域包裹起来，这样更新层级将大大减少
 * @supported weapp, swan, alipay, tt, jd, qq
 * @example
 * ```tsx
 * import { Component } from 'react'
 * import { CustomWrapper, View, Text } from '@tarojs/components'
 * 
 * export default class C extends Component {
 *   render () {
 *     return (
 *       <View>
 *         <CustomWrapper>
 *            <Text>Hello, world!</Text>
 *         </CustomWrapper>
 *       </View>
 *     )
 *   }
 * }
 * ```
 */
declare const CustomWrapper: ComponentType<CustomWrapperProps>

export { CustomWrapper, CustomWrapperProps }