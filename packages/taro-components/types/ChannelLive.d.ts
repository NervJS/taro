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
interface ChannelLiveProps extends StandardProps {
  /** 视频 feedId
   * @supported weapp
   */
  feedId: string

  /** 视频号 id，以“sph”开头的id，可在视频号助手获取。视频号必须与当前小程序相同主体。
   * @supported weapp
   */
  finderUserName: string
}

/**
 * 小程序内嵌视频号直播组件，展示视频号直播状态和封面，并无弹窗跳转至视频号。注意：使用该组件打开的视频号视频需要与小程序的主体一致。
 * @classification media
 * @supported weapp
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/channel-live.html
 */
declare const ChannelLive: ComponentType<ChannelLiveProps>
export { ChannelLive, ChannelLiveProps }
