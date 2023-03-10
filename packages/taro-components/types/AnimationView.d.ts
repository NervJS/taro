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
interface AnimationViewProps extends StandardProps {
  /** 动画资源地址，目前只支持绝对路径
   * @supported swan
   */
  path?: string

  /** 动画是否循环播放
   * @supported swan
   * @default false
   */
  loop?: boolean

  /** 动画是否自动播放
   * @supported swan
   * @default true
   */
  autoplay?: boolean

  /** 动画操作，可取值 play、pause、stop
   * @supported swan
   * @default "play"
   */
  action?: 'play' | 'pause' | 'stop'

  /** 是否隐藏动画
   * @supported swan
   * @default true
   */
  hidden?: boolean

  /** 当播放到末尾时触发 ended 事件（自然播放结束会触发回调，循环播放结束及手动停止动画不会触发）
   * @supported swan
   */
  onEnded?: CommonEventFunction
}

/** Lottie 动画
 * @classification media
 * @supported swan
 * @see https://smartprogram.baidu.com/docs/develop/component/animation-view-Lottie/
 */
declare const AnimationView: ComponentType<AnimationViewProps>
export { AnimationView, AnimationViewProps }
