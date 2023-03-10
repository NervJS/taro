/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
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
interface MovableAreaProps extends StandardProps {
  /** 当里面的 movable-view 设置为支持双指缩放时，设置此值可将缩放手势生效区域修改为整个 movable-area
   * @default false
   * @supported weapp, alipay, swan, tt, qq, jd, h5
   */
  scaleArea?: boolean
}

/** movable-view 的可移动区域
 * @classification viewContainer
 * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
 * @example_react
 * ```tsx
 * class App extends Components {
 *   render () {
 *     return (
 *       <MovableArea style='height: 200px; width: 200px; background: red;'>
 *         <MovableView style='height: 50px; width: 50px; background: blue;' direction='all'>旅行的意义</MovableView>
 *       </MovableArea>
 *     )
 *   }
 * }
 * ```
 * @example_vue
 * ```html
 *   <movable-area style='height: 200px; width: 200px; background: red;'>
 *     <movable-view style='height: 50px; width: 50px; background: blue;' direction='all'>在路上</movable-view>
 *   </movable-area>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/movable-area.html
 */
declare const MovableArea: ComponentType<MovableAreaProps>
export { MovableArea, MovableAreaProps }
