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
interface LifestyleProps extends StandardProps {
  /** 必填，生活号 ID（即生活号 APPID），必须是当前小程序同账号主体且已关联的生活号。
   * @supported alipay
   */
  publicId?: string

  /** 文案。支持商家自定义，最多展示一行。
   * @supported alipay
   */
  memo?: string

  /** 当用户关注生活号成功后执行。
   * @supported alipay
   */
  onFollow?: CommonEventFunction
}

/** 关注生活号
 * @classification open
 * @supported alipay
 * @see https://opendocs.alipay.com/mini/component/lifestyle
 */
declare const Lifestyle: ComponentType<LifestyleProps>
export { Lifestyle, LifestyleProps }
