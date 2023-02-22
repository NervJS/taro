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
interface TabsProps extends StandardProps {
  /** tabs 背景色,必须填写十六进制颜色
   * @supported swan
   * @default "#fff"
   */
  tabsBackgroundColor?: string

  /** tabs 激活 tab-item 文字颜色
   * @supported swan
   * @default "#000"
   */
  tabsActiveTextColor?: string

  /** tabs 非激活 tab-item 文字颜色
   * @supported swan
   * @default "#666"
   */
  tabsInactiveTextColor?: string

  /** tabs 激活 tab-item 下划线颜色
   * @supported swan
   * @default "#333"
   */
  tabsUnderlineColor?: string

  /** 仅用于普通标签栏组件，当前激活 tab-item 的对应的 name 值，须搭配 bindtabchange 一起使用。
   * @supported swan
   * @default 无
   */
  activeName?: string

  /** 仅用于可寻址标签栏组件，当前 tab 所改变的 url query 中参数 key，需要通过 tabs 修改页面 url 的时候设置。
   * @supported swan
   * @default 无
   */
  urlQueryName?: string

  /** 当前 tabs 视图中最多容纳的 tab-item 数量，低于此数量均分排列，超出此数量划屏。默认五个，开发者可根据业务需求调整
   * @supported swan
   * @default 5
   */
  maxTabItemAmount?: number

  /** tab 被点击的回调，可以在 e.detail.name 中取到当前点击的 tab-item 对应的 name 值
   * @supported swan
   */
  onTabChange?: CommonEventFunction
}

/** 标签栏
 * @classification navig
 * @supported swan
 * @see https://smartprogram.baidu.com/docs/develop/component/tabs/
 */
declare const Tabs: ComponentType<TabsProps>
export { Tabs, TabsProps }
