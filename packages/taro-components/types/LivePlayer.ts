import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction, netStatus } from './common'

interface LivePlayerProps extends StandardProps {
  /** 音视频地址。目前仅支持 flv, rtmp 格式
   * @supported weapp
   */
  src?: string

  /** 模式
   * @default "live"
   * @supported weapp
   */
  mode?: keyof LivePlayerProps.mode

  /** 自动播放
   * @default false
   * @supported weapp
   */
  autoplay?: boolean

  /** 是否静音
   * @default false
   * @supported weapp
   */
  muted?: boolean

  /** 画面方向
   * @default "vertical"
   * @supported weapp
   */
  orientation?: keyof LivePlayerProps.orientation

  /** 填充模式
   * @default "contain"
   * @supported weapp
   */
  objectFit?: keyof LivePlayerProps.objectFit

  /** 进入后台时是否静音（已废弃，默认退台静音）
   * @default false
   * @supported weapp
   * @deprecated
   */
  backgroundMute?: boolean

  /** 进最小缓冲区，单位s
   * @default 1
   * @supported weapp
   */
  minCache?: number

  /** 进最小缓冲区，单位s
   * @default 3
   * @supported weapp
   */
  maxCache?: number

  /** 声音输出方式
   * @default "speaker"
   * @supported weapp
   */
  soundMode?: keyof LivePlayerProps.soundMode

  /** 当跳转到本小程序的其他页面时，是否自动暂停本页面的实时音视频播放
   * @default true
   * @supported weapp
   */
  autoPauseIfNavigate?: boolean

  /** 当跳转到其它微信原生页面时，是否自动暂停本页面的实时音视频播放
   * @default true
   * @supported weapp
   */
  autoPauseIfOpenNavigate?: boolean

  /** 播放状态变化事件，detail = {code}
   * @supported weapp
   */
  onStateChange?: CommonEventFunction<LivePlayerProps.onStateChangeEventDetail>

  /** 全屏变化事件，detail = {direction, fullScreen}
   * @supported weapp
   */
  onFullScreenChange?: CommonEventFunction<LivePlayerProps.onFullScreenChangeEventDetail>

  /** 网络状态通知，detail = {info}
   * @supported weapp
   */
  onNetstatus?: CommonEventFunction<LivePlayerProps.onNetStatusEventDetail>

  /** 播放音量大小通知，detail = {}
   * @supported weapp
   */
  onAudioVolumenotify?: CommonEventFunction<{}>
}

declare namespace LivePlayerProps {
  /** mode 的合法值 */
  interface mode {
    /** 直播 */
    live
    /** 实时通话，该模式时延更低 */
    RTC
  }
  /** orientation 的合法值 */
  interface orientation {
    /** 竖直 */
    vertical
    /** 水平 */
    horizontal
  }
  /** objectFit 的合法值 */
  interface objectFit {
    /** 图像长边填满屏幕，短边区域会被填充⿊⾊ */
    contain
    /** 图像铺满屏幕，超出显示区域的部分将被截掉 */
    fillCrop
  }
  /** soundMode 的合法值 */
  interface soundMode {
    /** 扬声器 */
    speaker
    /** 听筒 */
    ear
  }

  interface onStateChangeEventDetail {
    /** 状态码 */
    code: number
  }
  interface onFullScreenChangeEventDetail {
    /** 方向 */
    direction: number
    /** 全屏 */
    fullScreen: number | boolean
  }
  interface onNetStatusEventDetail {
    info: netStatus
  }
  /** 状态码 */
  interface status {
    /** 已经连接服务器 */
    2001
    /** 已经连接 RTMP 服务器,开始拉流 */
    2002
    /** 网络接收到首个视频数据包(IDR) */
    2003
    /** 视频播放开始 */
    2004
    /** 视频播放进度 */
    2005
    /** 视频播放结束 */
    2006
    /** 视频播放Loading */
    2007
    /** 解码器启动 */
    2008
    /** 视频分辨率改变 */
    2009
    /** 网络断连，且经多次重连抢救无效，更多重试请自行重启播放 */
    '-2301'
    /** 获取加速拉流地址失败 */
    '-2302'
    /** 当前视频帧解码失败 */
    2101
    /** 当前音频帧解码失败 */
    2102
    /** 网络断连, 已启动自动重连 */
    2103
    /** 网络来包不稳：可能是下行带宽不足，或由于主播端出流不均匀 */
    2104
    /** 当前视频播放出现卡顿 */
    2105
    /** 硬解启动失败，采用软解 */
    2106
    /** 当前视频帧不连续，可能丢帧 */
    2107
    /** 当前流硬解第一个I帧失败，SDK自动切软解 */
    2108
    /** RTMP -DNS解析失败 */
    3001
    /** RTMP服务器连接失败 */
    3002
    /** RTMP服务器握手失败 */
    3003
    /** RTMP 读/写失败 */
    3005
  }
}

/** 实时音视频播放。相关api：Taro.createLivePlayerContext
 *
 * 需要先通过类目审核，再在小程序管理后台，“设置”-“接口设置”中自助开通该组件权限。
 * @classification media
 * @supported weapp
 * @example
 * ```tsx
 * class App extends Components {
 *   render () {
 *     return (
 *       <LivePlayer src='url' mode='live' autoplay  />
 *     )
 *   }
 * }
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/live-player.html
 */
declare const LivePlayer: ComponentType<LivePlayerProps>

export { LivePlayer, LivePlayerProps }
