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
interface RootPortalProps extends StandardProps {
  /**
   * 是否从页面中脱离出来
   * @supported weapp
   * @default true
   */
  enable?: boolean
}

/** root-portal
 * 使整个子树从页面中脱离出来，类似于在 CSS 中使用 fixed position 的效果。主要用于制作弹窗、弹出层等。
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/root-portal.html
 * @classification viewContainer
 * @supported weapp
 * @example_react
 * ```tsx
 * import { useState } from 'react'
 * import { RootPortal, View, Button } from '@tarojs/components'
 *
 * export default function RootPortalExample {
 *   const [show, setShow] = useState(false)
 *   const toggle = () => {
 *     setShow(!show)
 *   }
 *   render () {
 *     return (
 *       <View>
 *         <Button onClick={toggle}>显示root-portal</Button>
 *         {
 *           show && (<RootPortal><View>content</View></RootPortal>)
 *         }
 *       </View>
 *     )
 *   }
 * }
 * ```
 */
declare const RootPortal: ComponentType<RootPortalProps>
export { RootPortal, RootPortalProps }
