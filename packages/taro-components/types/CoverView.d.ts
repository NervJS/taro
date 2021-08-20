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
import { ViewProps } from './View'

interface CoverViewProps extends ViewProps {
  /** 设置顶部滚动偏移量，仅在设置了 overflow-y: scroll 成为滚动元素后生效
   * @supported weapp
   */
  scrollTop?: number

  /**
   * 适用于地图组件 map 的自定义气泡 customCallout
   * @supported weapp
   */
  markerId?: string

  /**
   * @supported weapp
   */
  slot?: string
}

/** 覆盖在原生组件之上的文本视图。可覆盖的原生组件包括 map、video、canvas、camera、live-player、live-pusher 只支持嵌套 cover-view、cover-image，可在 cover-view 中使用 button。
 * @classification viewContainer
 * @supported weapp, swan, alipay
 * @example
 * ```tsx
 * class App extends Components {
 *   render () {
 *     return (
 *       <Video id='myVideo' src='src'>
 *         <CoverView class='controls'>
 *           <CoverView class='play' onClick='play'>
 *             <CoverImage class='img' src='src' />
 *           </CoverView>
 *         </CoverView>
 *       </Video>
 *     )
 *   }
 * }
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/cover-view.html
 */
declare const CoverView: ComponentType<CoverViewProps>

export { CoverView, CoverViewProps }
