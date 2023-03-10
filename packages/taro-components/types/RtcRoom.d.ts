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
interface RtcRoomProps extends StandardProps {
  /** rtc-room 组件的唯一标识符
   * @supported swan
   */
  id?: string

  /** 是否开启摄像头
   * @supported swan
   * @default true
   */
  enableCamera?: boolean

  /** 是否开启摄像头自动对焦
   * @supported swan
   * @default true
   */
  enableAutoFocus?: boolean

  /** 是否支持双手滑动调整摄像头聚焦
   * @supported swan
   * @default false
   */
  enableZoom?: boolean

  /** 设置前置还是后置摄像头，有效值：front、back
   * @supported swan
   * @default "front"
   */
  devicePosition?: 'front' | 'back'

  /** 是否开启麦克风
   * @supported swan
   * @default true
   */
  enableMic?: boolean

  /** 是否开启音频自动增益
   * @supported swan
   * @default false
   */
  enableAgc?: boolean

  /** 是否开启音频噪声抑制
   * @supported swan
   * @default false
   */
  enableAns?: boolean

  /** 最大码率
   * @supported swan
   * @default 900
   */
  bitrate?: number

  /** 视频分辨率宽
   * @supported swan
   * @default 360
   */
  videoWidth?: number

  /** 视频分辨率高
   * @supported swan
   * @default 640
   */
  videoHeight?: number

  /** 设置远端看到的画面的镜像效果，该属性的变化不会影响到本地画面，仅影响远端看到的画面效果
   * @supported swan
   * @default false
   */
  enableRemoteMirror?: boolean

  /** 设置本地摄像头预览画面的镜像效果，有效值：auto、enable、disable
   * @supported swan
   * @default "auto"
   */
  localMirror?: 'auto' | 'enable' | 'disable'

  /** 设置声音输出方式，有效值：speaker、ear
   * @supported swan
   * @default "speaker"
   */
  soundMode?: 'speaker' | 'ear'

  /** 房间状态变化事件，参考下方状态码，detail = { code, msg, userInfo }
   * @supported swan
   */
  onStateChange?: CommonEventFunction

  /** 错误事件。参考下方错误码，detail = { errMsg, errCode }
   * @supported swan
   */
  onError?: CommonEventFunction
}

/** 实时音视频通话房间
 * @classification media
 * @supported swan
 * @see https://smartprogram.baidu.com/docs/develop/component/media_rtc-room/
 */
declare const RtcRoom: ComponentType<RtcRoomProps>
export { RtcRoom, RtcRoomProps }
