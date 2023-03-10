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
import { StandardProps, CommonEventFunction } from './common'
interface NavigationBarProps extends StandardProps {
  /** 导航条标题
   * @supported weapp
   */
  title?: string

  /** 是否在导航条显示 loading 加载提示
   * @supported weapp
   */
  loading?: boolean

  /** 导航条前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
   * @supported weapp
   */
  frontColor?: string

  /** 导航条背景颜色值，有效值为十六进制颜色
   * @supported weapp
   */
  backgroundColor?: string

  /** 改变导航栏颜色时的动画时长，默认为 0 （即没有动画效果）
   * @default 0
   * @supported weapp
   */
  colorAnimationDuration?: string

  /** 改变导航栏颜色时的动画方式，支持 linear 、 easeIn 、 easeOut 和 easeInOut
   * @default "linear"
   * @supported weapp
   */
  colorAnimationTimingFunc?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut'
}

/** 页面导航条配置节点，用于指定导航栏的一些属性。只能是 PageMeta 组件内的第一个节点，需要配合它一同使用。
 * 通过这个节点可以获得类似于调用 Taro.setNavigationBarTitle Taro.setNavigationBarColor 等接口调用的效果。
 * @classification navig
 * @supported weapp, harmony
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/navigation-bar.html
 */
declare const NavigationBar: ComponentType<NavigationBarProps>
export { NavigationBar, NavigationBarProps }
