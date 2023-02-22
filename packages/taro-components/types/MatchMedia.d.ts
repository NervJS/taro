/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { ComponentType } from 'react'
import { StandardProps } from './common'
interface MatchMediaProps extends StandardProps {
  /** 页面最小宽度（ px 为单位）
   * @supported weapp, alipay
   */
  minWidth?: number

  /** 页面最大宽度（ px 为单位）
   * @supported weapp, alipay
   */
  maxWidth?: number

  /** 页面宽度（ px 为单位）
   * @supported weapp, alipay
   */
  width?: number

  /** 页面最小高度（ px 为单位）
   * @supported weapp, alipay
   */
  minHeight?: number

  /** 页面最大高度（ px 为单位）
   * @supported weapp, alipay
   */
  maxHeight?: number

  /** 页面高度（ px 为单位）
   * @supported weapp, alipay
   */
  height?: number

  /** 屏幕方向（ landscape 或 portrait ）
   * @supported weapp, alipay
   */
  orientation?: string
}

/** media query 匹配检测节点。可以指定一组 media query 规则，满足时，这个节点才会被展示。
 * 通过这个节点可以实现“页面宽高在某个范围时才展示某个区域”这样的效果。
 * @supported weapp, alipay
 * @classification viewContainer
 * @example_react
 * ```tsx
 * class App extends Components {
 *   render () {
 *     return (
 *       <View>
 *         <MatchMedia minWidth="300" maxWidth="600">
 *           <view>当页面宽度在 300 ~ 500 px 之间时展示这里</view>
 *         </MatchMedia>
 *         <MatchMedia minHeight="400" orientation="landscape">
 *           <view>当页面高度不小于 400 px 且屏幕方向为纵向时展示这里</view>
 *         </MatchMedia>
 *       </View>
 *     )
 *   }
 * }
 * ```
 * @example_vue
 * ```html
 * <template>
 *   <view class="components-page">
 *     <match-media min-width="300" max-width="500">
 *       <view>当页面宽度在 300 ~ 500 px 之间时展示这里</view>
 *     </match-media>
 *     <match-media min-height="400" orientation="landscape">
 *       <view>当页面高度不小于 400 px 且屏幕方向为纵向时展示这里</view>
 *     </match-media>
 *   </view>
 * </template>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/match-media.html
 */
declare const MatchMedia: ComponentType<MatchMediaProps>
export { MatchMedia, MatchMediaProps }
