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

interface MatchMediaProps extends StandardProps {
  /** 页面最小宽度（ px 为单位）
   * @supported weapp
   */
  minWidth?:	number

  /** 页面最大宽度（ px 为单位）
   * @supported weapp
   */
  maxWidth?: number

  /** 页面宽度（ px 为单位）
   * @supported weapp
   */
  width?: number

  /** 页面最小高度（ px 为单位）
   * @supported weapp
   */
  minHeight?: number

  /** 页面最大高度（ px 为单位）
   * @supported weapp
   */
  maxHeight?: number

  /** 页面高度（ px 为单位）
   * @supported weapp
   */
  height?: number

  /** 屏幕方向（ landscape 或 portrait ）
   * @supported weapp
   */
  orientation?: string
}

/** media query 匹配检测节点。可以指定一组 media query 规则，满足时，这个节点才会被展示。
 * 通过这个节点可以实现“页面宽高在某个范围时才展示某个区域”这样的效果。
 * 基础库 2.11.1 开始支持。
 * @supported weapp
 * @example
 * ```tsx
 * class App extends Components {
 *   render () {
 *     return (
 *        <MatchMedia minWidth='400'>
            <View>title</View>
          </MatchMedia>
 *     )
 *   }
 * }
 * ```
 */
declare const MatchMedia: ComponentType<MatchMediaProps>

export { MatchMedia, MatchMediaProps }
