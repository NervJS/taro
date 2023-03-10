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
interface OfficialAccountProps extends StandardProps {
  /** 组件加载成功时触发
   * @supported weapp
   */
  onLoad?: CommonEventFunction<OfficialAccountProps.Detail>

  /** 组件加载失败时触发
   * @supported weapp
   */
  onError?: CommonEventFunction<OfficialAccountProps.Detail>
}
declare namespace OfficialAccountProps {
  /** detail 对象 */
  interface Detail {
    /** 状态码 */
    status: number

    /** 错误信息 */
    errMsg: string
  }

  /** status 有效值 */
  interface Status {
    /** 网络错误 */
    '-2'

    /** 数据解析错误 */
    '-1'

    /** 加载成功 */
    0

    /** 小程序关注公众号功能被封禁 */
    1

    /** 关联公众号被封禁 */
    2

    /** 关联关系解除或未选中关联公众号 */
    3

    /** 未开启关注公众号功能 */
    4

    /** 场景值错误 */
    5

    /** 重复创建 */
    6
  }
}

/** 公众号关注组件。当用户扫小程序码打开小程序时，开发者可在小程序内配置公众号关注组件，方便用户快捷关注公众号，可嵌套在原生组件内。
 *
 * Tips
 * 使用组件前，需前往小程序后台，在“设置”->“关注公众号”中设置要展示的公众号。注：设置的公众号需与小程序主体一致。
 *
 * 在一个小程序的生命周期内，只有从以下场景进入小程序，才具有展示引导关注公众号组件的能力:
 *
 * 当小程序从扫小程序码场景（场景值1047，场景值1124）打开时
 * 当小程序从聊天顶部场景（场景值1089）中的「最近使用」内打开时，若小程序之前未被销毁，则该组件保持上一次打开小程序时的状态
 * 当从其他小程序返回小程序（场景值1038）时，若小程序之前未被销毁，则该组件保持上一次打开小程序时的状态
 * @classification open
 * @supported weapp
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/official-account.html
 */
declare const OfficialAccount: ComponentType<OfficialAccountProps>
export { OfficialAccount, OfficialAccountProps }
