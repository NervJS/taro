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
import { CommonEventFunction, StandardProps } from './common'
interface VoipRoomProps extends StandardProps {
  /** 对话窗口类型，自身传入 camera，其它用户传入 video
   * @default camera
   * @supported weapp
   */
  mode?: keyof VoipRoomProps.Mode

  /** 仅在 mode 为 camera 时有效，前置或后置，值为front, back
   * @default front
   * @supported weapp
   */
  devicePosition?: keyof VoipRoomProps.DevicePosition

  /** 进入房间用户的 openid
   * @default "none"
   * @supported weapp
   */
  openId?: string

  /** 画面与容器比例不一致时，画面的表现形式
   * @supported weapp
   * @default "fill"
   */
  objectFit?: 'fill' | 'contain' | 'cover'

  /** 创建对话窗口失败时触发
   * @supported weapp
   */
  onError?: CommonEventFunction
}
declare namespace VoipRoomProps {
  /** 对话窗口类型 */
  interface Mode {
    camera
    video
  }

  /** 摄像头类型 */
  interface DevicePosition {
    front
    back
  }
}

/** 多人音视频对话
 *
 * 需用户授权 `scope.camera`、`scope.record`。相关接口： [Taro.joinVoIPChat](/docs/apis/media/voip/joinVoIPChat)
 * 开通该组件权限后，开发者可在 joinVoIPChat 成功后，获取房间成员的 openid，传递给 voip-room 组件，以显示成员画面。
 * @classification media
 * @supported weapp
 * @example
 * ```tsx
 * export default class PageView extends Component {
 *   constructor() {
 *     super(...arguments)
 *   }
 *
 *   render() {
 *     return (
 *       <VoipRoom
 *         openId="{{item}}"
 *         mode="{{selfOpenId === item ? 'camera' : 'video'}}">
 *       </VoipRoom>
 *     )
 *   }
 * }
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/voip-room.html
 */
declare const VoipRoom: ComponentType<VoipRoomProps>
export { VoipRoom, VoipRoomProps }
