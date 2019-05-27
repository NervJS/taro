import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

/**
 * 实时音视频录制。
 * 需要用户授权 scope.camera、scope.record
 * 暂只针对国内主体如下类目的小程序开放，需要先通过类目审核，再在小程序管理后台，“设置”-“接口设置”中自助开通该组件权限。
 * @since 1.7.0
 * @see {@link https://developers.weixin.qq.com/miniprogram/dev/component/live-pusher.html}
 */
export interface LivePusherProps extends StandardProps {

  /**
   * 推流地址。目前仅支持 flv, rtmp 格式
   */
  url: string,

  /**
   * SD（标清）, HD（高清）, FHD（超清）, RTC（实时通话）
   * 默认值：`RTC`
   */
  mode: 'SD' | 'HD' | 'FHD' | 'RTC',

  /**
   * 自动推流
   * 默认值：`false`
   */
  autopush: boolean,

  /**
   * 是否静音
   * 默认值：`false`
   */
  muted: boolean,

  /**
   * 开启摄像头
   * 默认值：`true`
   */
  enableCamera: boolean,

  /**
   * 自动聚集
   * 默认值：`true`
   */
  autoFocus: boolean,

  /**
   * 画面方向，可选值有 vertical，horizontal
   * 默认值：`vertical`
   */
  orientation: 'vertical' | 'horizontal',

  /**
   * 美颜
   * 默认值：`0`
   */
  beauty: number,

  /**
   * 美白
   * 默认值：`0`
   */
  whiteness: number,

  /**
   * 宽高比，可选值有 3:4, 9:16
   * 默认值：`9:16`
   */
  aspect: '9:16' | '3:4',

  /**
   * 最小码率
   * 默认值：`200`
   */
  minBitrate: number,

  /**
   * 最大码率
   * 默认值：`1000`
   */
  maxBitrate: number,

  /**
   * 进入后台时推流的等待画面
   */
  waitingImage: string,

  /**
   * 等待画面资源的MD5值
   */
  waitingImageHash: string,

  /**
   * 调整焦距
   * 默认值：`false`
   */
  zoom: boolean,

  /**
   * 进入后台时是否静音
   * 默认值：`false`
   */
  backgroundMute: boolean,

  /**
   * 状态变化事件，detail = {code}
   */
  onStateChange?: CommonEventFunction,

  /**
   * 网络状态通知，detail = {info}
   */
  onNetstatus?: CommonEventFunction,

  /**
   * 渲染错误事件，detail = {errMsg, errCode}
   */
  onError?: CommonEventFunction
}

declare const LivePusher: ComponentType<LivePusherProps>

export { LivePusher }
