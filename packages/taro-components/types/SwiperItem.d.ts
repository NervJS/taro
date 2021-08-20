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

interface SwiperItemProps extends StandardProps {
  /** 该 swiper-item 的标识符
   * @supported weapp
   */
  itemId?: string
}

/** 仅可放置在 swiper 组件中，宽高自动设置为100%
 * @classification viewContainer
 * @supported weapp
 * @example
 * ```tsx
 * class App extends Component {
 *   render () {
 *     return (
 *       <Swiper
 *         className='test-h'
 *         indicatorColor='#999'
 *         indicatorActiveColor='#333'
 *         vertical
 *         circular
 *         indicatorDots
 *         autoplay>
 *         <SwiperItem>
 *           <View className='demo-text-1'>1</View>
 *         </SwiperItem>
 *         <SwiperItem>
 *           <View className='demo-text-2'>2</View>
 *         </SwiperItem>
 *         <SwiperItem>
 *           <View className='demo-text-3'>3</View>
 *         </SwiperItem>
 *       </Swiper>
 *     )
 *   }
 * }
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/swiper-item.html
 */
declare const SwiperItem: ComponentType<SwiperItemProps>

export { SwiperItem, SwiperItemProps }
