import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction, netStatus } from './common'

/** 实时音视频录制。
 * 需要用户授权 scope.camera、scope.record
 * 暂只针对国内主体如下类目的小程序开放，需要先通过类目审核，再在小程序管理后台，“设置”-“接口设置”中自助开通该组件权限。
 */
interface LivePusherProps extends StandardProps {
  /** 推流地址。目前仅支持 rtmp 格式
   * @supported weapp
   */
  url?: string

  /** SD（标清）, HD（高清）, FHD（超清）, RTC（实时通话）
   * @default "RTC"
   * @supported weapp
   */
  mode?: 'SD' | 'HD' | 'FHD' | 'RTC'

  /** 自动推流
   * @default false
   * @supported weapp
   */
  autopush?: boolean

  /** 是否静音。即将废弃，可用 enable-mic 替代
   * @default false
   * @deprecated
   * @supported weapp
   */
  muted?: boolean

  /** 开启摄像头
   * @default true
   * @supported weapp
   */
  enableCamera?: boolean

  /** 自动聚集
   * @default true
   * @supported weapp
   */
  autoFocus?: boolean

  /** 画面方向
   * @default "vertical"
   * @supported weapp
   */
  orientation?: keyof LivePusherProps.orientation

  /** 美颜，取值范围 0-9 ，0 表示关闭
   * @default 0
   * @supported weapp
   */
  beauty?: number

  /** 美白，取值范围 0-9 ，0 表示关闭
   * @default 0
   * @supported weapp
   */
  whiteness?: number

  /** 宽高比，可选值有 3:4, 9:16
   * @default "9:16"
   * @supported weapp
   */
  aspect?: '9:16' | '3:4'

  /** 最小码率
   * @default 200
   * @supported weapp
   */
  minBitrate?: number

  /** 最大码率
   * @default 1000
   * @supported weapp
   */
  maxBitrate?: number

  /** 高音质(48KHz)或低音质(16KHz)，值为high, low
   * @default "high"
   * @supported weapp
   */
  audioQuality?: string

  /** 进入后台时推流的等待画面
   * @supported weapp
   */
  waitingImage?: string

  /** 等待画面资源的MD5值
   * @supported weapp
   */
  waitingImageHash?: string

  /** 调整焦距
   * @default false
   * @supported weapp
   */
  zoom?: boolean

  /** 前置或后置，值为front, back
   * @default "front"
   * @supported weapp
   */
  devicePosition?: string

  /** 进入后台时是否静音
   * @default false
   * @supported weapp
   */
  backgroundMute?: boolean

  /** 设置推流画面是否镜像，产生的效果在 LivePlayer 反应到
   * @default false
   * @supported weapp
   * @deprecated
   */
  mirror?: boolean

  /** 设置推流画面是否镜像，产生的效果在 LivePlayer 反应到
   * 
   * **Note:** 同 mirror 属性，后续 mirror 将废弃
   * @default false
   * @supported weapp
   */
  remoteMirror?: boolean

  /** 控制本地预览画面是否镜像
   * @default "auto"
   * @supported weapp
   */
  localMirror?: keyof LivePusherProps.localMirror

  /** 音频混响类型
   * @default 0
   * @supported weapp
   */
  audioReverbType?: keyof LivePusherProps.audioReverbType

  /** 开启或关闭麦克风
   * @default true
   * @supported weapp
   */
  enableMic?: boolean

  /** 是否开启音频自动增益
   * @default false
   * @supported weapp
   */
  enableAgc?: boolean

  /** 是否开启音频噪声抑制
   * @default false
   * @supported weapp
   */
  enableAns?: boolean

  /** 音量类型
   * @default "voicecall"
   * @supported weapp
   */
  audioVolumeType?: keyof LivePusherProps.audioVolumeType

  /** 上推的视频流的分辨率宽度
   * @default 360
   * @supported weapp
   */
  videoWidth?: number

  /** 上推的视频流的分辨率高度
   * @default 640
   * @supported weapp
   */
  videoHeight?: number

  /** 状态变化事件，detail = {code}
   * @supported weapp
   */
  onStateChange?: CommonEventFunction<LivePusherProps.onStateChangeEventDetail>

  /** 网络状态通知，detail = {info}
   * @supported weapp
   */
  onNetstatus?: CommonEventFunction<LivePusherProps.onNetstatusEventDetail>

  /** 渲染错误事件，detail = {errMsg, errCode}
   * @supported weapp
   */
  onError?: CommonEventFunction<LivePusherProps.onErrorEventDetail>

  /** 背景音开始播放时触发
   * @supported weapp
   */
  onBgmStart?: CommonEventFunction

  /** 背景音进度变化时触发，detail = {progress, duration}
   * @supported weapp
   */
  onBgmProgress?: CommonEventFunction<LivePusherProps.onBgmProgressEventDetail>

  /** 背景音播放完成时触发
   * @supported weapp
   */
  onBgmComplete?: CommonEventFunction
}

declare namespace LivePusherProps {
  /** orientation 的合法值 */
  interface orientation {
    /** 竖直 */
    vertical
    /** 水平 */
    horizontal
  }
  /** localMirror 的合法值 */
  interface localMirror {
    /** 前置摄像头镜像，后置摄像头不镜像 */
    auto
    /** 前后置摄像头均镜像 */
    enable
    /** 前后置摄像头均不镜像 */
    disable
  }
  /** audioReverbType 的合法值 */
  interface audioReverbType {
    /** 关闭 */
    0		
    /** KTV */
    1
    /** 小房间 */
    2
    /** 大会堂 */
    3
    /** 低沉 */
    4
    /** 洪亮 */
    5
    /** 金属声 */
    6
    /** 磁性 */
    7
  }
  /** audioVolumeType 的合法值 */
  interface audioVolumeType {
    /** 媒体音量 */
    media
    /** 通话音量 */
    voicecall
  }
  interface onStateChangeEventDetail {
    /** 状态码 */
    code: number
  }
  interface onNetstatusEventDetail {
    /** 网络状态 */
    info: netStatus
  }
  interface onErrorEventDetail {
    /** 错误信息 */
    errMsg: string
    /** 错误码 */
    errCode: string | number
  }
  interface onBgmProgressEventDetail {
    /** 进展 */
    progress
    /** 持续时间 */
    duration: number
  }
}

/** 实时音视频录制。需要用户授权 scope.camera、scope.record
 * 
 * 需要先通过类目审核，再在小程序管理后台，「开发」-「接口设置」中自助开通该组件权限。
 * @classification media
 * @supported weapp
 * @example
 * ```tsx
 * class App extends Components {
 *   render () {
 *     return (
 *       <LivePusher url='url' mode='RTC' autopush  />
 *     )
 *   }
 * }
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/live-pusher.html
 */
declare const LivePusher: ComponentType<LivePusherProps>

export { LivePusher, LivePusherProps }
