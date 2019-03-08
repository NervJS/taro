import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

/**
 * 实时音视频播放。
 * 暂只针对国内主体如下类目的小程序开放，需要先通过类目审核，再在小程序管理后台，“设置”-“接口设置”中自助开通该组件权限。
 * @since 1.7.0
 * @see {@link https://developers.weixin.qq.com/miniprogram/dev/component/live-player.html}
 */
export interface LivePlayerProps extends StandardProps {

  /**
   * 音视频地址。目前仅支持 flv, rtmp 格式
   */
  src: string,

  /**
   * live（直播），RTC（实时通话）
   * 默认值：`live`
   */
  mode: 'live' | 'RTC',

  /**
   * 自动播放
   * 默认值：`false`
   */
  autoplay: boolean,

  /**
   * 是否静音
   * 默认值：`false`
   */
  muted: boolean,

  /**
   * 画面方向，可选值有 vertical，horizontal
   * 默认值：`vertical`
   */
  orientation: 'vertical' | 'horizontal',

  /**
   * 填充模式，可选值有 contain，fillCrop
   * 默认值：`contain`
   */
  objectFit: 'contain' | 'fillCrop',

  /**
   * @deprecated
   * 进入后台时是否静音（已废弃，默认退台静音）
   * 默认值：`false`
   */
  backgroundMute: boolean,

  /**
   * 进最小缓冲区，单位s
   * 默认值：`1`
   */
  minCache: number,

  /**
   * 进最小缓冲区，单位s
   * 默认值：`3`
   */
  maxCache: number,

  /**
   * 播放状态变化事件，detail = {code}
   */
  onStateChange?: CommonEventFunction,

  /**
   * 全屏变化事件，detail = {direction, fullScreen}
   */
  onFullscreenChange?: CommonEventFunction,

  /**
   * 网络状态通知，detail = {info}
   */
  onNetstatus?: CommonEventFunction
}

declare const LivePlayer: ComponentType<LivePlayerProps>

export { LivePlayer }
