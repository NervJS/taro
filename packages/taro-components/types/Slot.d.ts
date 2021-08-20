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

interface SlotProps {
  /** 指定插入的 slot 位置
   * @default none
   * @supported weapp, swan, alipay, tt, jd, qq
   */
  name?: string,
  /** scoped slot 传入数据源
   * @default none
   * @supported swan
   */
  varName?: string
}

/** slot 插槽
 * @supported weapp, swan, alipay, tt, jd, qq
 * @example
 * ```tsx
 * import { Slot, View, Text } from '@tarojs/components'
 * 
 * export default class SlotView extends Component {
 *   render () {
 *     return (
 *       <View>
 *         <custom-component>
 *           <Slot name='title'>
 *            <Text>Hello, world!</Text>
 *           </Slot>
 *         </custom-component>
 *       </View>
 *     )
 *   }
 * }
 * ```
 */
declare const Slot: ComponentType<SlotProps>

export { Slot, SlotProps }