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
