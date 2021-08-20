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
import { StandardProps, CommonEventFunction } from './common'

interface CoverImageProps extends StandardProps {
  /** 图标路径，支持临时路径、网络地址、云文件ID。暂不支持base64格式。
   * @supported weapp
   */
  src: string

  /** 图片加载成功时触发
   * @supported weapp
   */
  onLoad?: CommonEventFunction

  /** 图片加载失败时触发
   * @supported weapp
   */
  onError?: CommonEventFunction
}

/** 覆盖在原生组件之上的图片视图。可覆盖的原生组件同cover-view，支持嵌套在cover-view里。
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
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/cover-image.html
 */
declare const CoverImage: ComponentType<CoverImageProps>

export { CoverImage, CoverImageProps }
