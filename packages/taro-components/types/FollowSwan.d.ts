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
interface FollowSwanProps extends StandardProps {
  /** 组件大小
   * @supported swan
   * @default "default"
   */
  size?: string

  /** 组件样式
   * @supported swan
   * @default "primary"
   */
  type?: string

  /** 关注和取消关注成功的回调，返回关注状态 {isFavor: true|false}
   * @supported swan
   */
  onFavorStatusChange?: CommonEventFunction
}

/** 关注小程序
 * @classification open
 * @supported swan
 * @see https://smartprogram.baidu.com/docs/develop/extended/component-content/follow-swan/
 */
declare const FollowSwan: ComponentType<FollowSwanProps>
export { FollowSwan, FollowSwanProps }
