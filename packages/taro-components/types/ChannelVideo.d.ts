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
interface ChannelVideoProps extends StandardProps {
  /** 视频 feedId
   * @supported weapp
   */
  feedId: string

  /** 视频号 id，以“sph”开头的id，可在视频号助手获取。视频号必须与当前小程序相同主体。
   * @supported weapp
   */
  finderUserName: string
  /** 是否循环播放
   * @supported weapp
   * @default false
   */
  loop?: boolean

  /** 是否静音播放
   * @supported weapp
   * @default false
   */
  muted?: boolean

  /** 当视频大小与 video 容器大小不一致时，视频的表现形式
   * @supported weapp
   * @default "contain"
   */
  objectFit?: 'fill' | 'contain' | 'cover'

  /** 是否自动播放
   * @supported weapp
   * @default false
   */
  autoplay?: boolean

  /** 视频播放出错时触发
   * @supported weapp
   */
  onError?: CommonEventFunction
}

/**
 * 小程序内嵌视频号视频组件，支持在小程序中播放视频号视频，并无弹窗跳转至视频号。注意：使用该组件打开的视频号视频需要与小程序相同主体或关联主体。
 * @classification media
 * @supported weapp
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/channel-video.html
 */
declare const ChannelVideo: ComponentType<ChannelVideoProps>
export { ChannelVideo, ChannelVideoProps }
