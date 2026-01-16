import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'
interface ChannelVideoProps extends StandardProps {
  /** 仅视频号视频与小程序同主体时生效。若内嵌非同主体视频，请使用 feed-token。
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
  /** 仅内嵌小程序非同主体视频号视频时使用，获取方式参考[本指引](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/channels-activity.html#feed-token)。
   * @supported weapp
   */
  feedToken?: string
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
