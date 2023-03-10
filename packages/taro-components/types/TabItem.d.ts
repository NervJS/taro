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
interface TabItemProps extends StandardProps {
  /** tab-item 内显示的文字
   * @supported swan
   * @default 无
   */
  label?: string

  /** tab-item 对应的 name 值
   * @supported swan
   * @default 无
   */
  name?: string

  /** 徽标类型 badge-type 分为圆点“dot”和文本“text”，不设置 badge-type 则不显示徽标
   * @supported swan
   * @default 无
   */
  badgeType?: string

  /** badge-type 为 text 的时候，徽标内的数字，为空时badge-type="text"不生效
   * @supported swan
   * @default 无
   */
  badgeText?: string
}

/** 标签栏子项
 * @classification navig
 * @supported swan
 * @see https://smartprogram.baidu.com/docs/develop/component/tab-item/
 */
declare const TabItem: ComponentType<TabItemProps>
export { TabItem, TabItemProps }
