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

interface MovableAreaProps extends StandardProps {
  /** 当里面的 movable-view 设置为支持双指缩放时，设置此值可将缩放手势生效区域修改为整个 movable-area
   * @default false
   * @supported weapp
   */
  scaleArea?: boolean
}

/** movable-view 的可移动区域
 * @classification viewContainer
 * @supported weapp
 * @example
 * ```tsx
 * class App extends Components {
 *   render () {
 *     return (
 *       <MovableArea style='height: 200px; width: 200px; background: red;'>
 *         <MovableView style='height: 50px; width: 50px; background: blue;' direction='all'></MovableView>
 *       </MovableArea>
 *     )
 *   }
 * }
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/movable-area.html
 */
declare const MovableArea: ComponentType<MovableAreaProps>

export { MovableArea, MovableAreaProps }
