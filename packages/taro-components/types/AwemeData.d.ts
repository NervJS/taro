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
interface AwemeDataProps extends StandardProps {
  /** 用户的抖音号，可以进入抖音 App 用户个人主页查看
   * @supported tt
   */
  awemeId?: string

  /** 类型，可以选择头像或昵称
   * @supported tt
   * @default "avatar"
   */
  type?: string

  /** 禁用默认行为。点击头像时，如果用户处于直播状态下默认会跳转到直播间，非直播状态下跳转到个人主页。如果为 true，点击头像时不会有默认行为。
   * @supported tt
   * @default false
   */
  disableDefault?: boolean

  /** 获取信息失败时显示的默认头像 url
   * @supported tt
   */
  defaultAvatar?: string

  /** 获取信息失败时显示的默认昵称文本
   * @supported tt
   */
  defaultText?: string

  /** 当错误发生时触发
   * @supported tt
   */
  onError?: CommonEventFunction
}

/** 直播间状态组件
 * @classification open
 * @supported tt
 * @see https://developer.open-douyin.com/docs/resource/zh-CN/mini-app/develop/component/open-capacity/aweme-data/
 */
declare const AwemeData: ComponentType<AwemeDataProps>
export { AwemeData, AwemeDataProps }
