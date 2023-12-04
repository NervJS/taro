import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction, NetStatus } from './common'
interface LivePlayerProps extends StandardProps {
  /** 音视频地址。目前仅支持 flv, rtmp 格式
   * @supported weapp, swan, tt, qq, jd
   */
  src?: string
  /** 模式
   * @default "live"
   * @supported weapp, qq, jd
   */
  mode?: keyof LivePlayerProps.Mode
  /** 自动播放
   * @default false
   * @supported weapp, swan, tt, qq, jd
   */
  autoplay?: boolean
  /** 是否静音
   * @default false
   * @supported weapp, swan, tt, qq, jd
   */
  muted?: boolean
  /** 画面方向
   * @default "vertical"
   * @supported weapp, swan, tt, qq, jd
   */
  orientation?: keyof LivePlayerProps.Orientation
  /** 填充模式
   * @default "contain"
   * @supported weapp, swan, tt, qq, jd
   */
  objectFit?: keyof LivePlayerProps.objectFit
  /** 进入后台时是否静音（已废弃，默认退台静音）
   * @default false
   * @supported weapp, swan
   * @deprecated
   */
  backgroundMute?: boolean
  /** 最小缓冲区，单位s
   * @default 1
   * @supported weapp, swan, qq
   */
  minCache?: number
  /** 最大缓冲区，单位s
   * @default 3
   * @supported weapp, swan, qq
   */
  maxCache?: number
  /** 声音输出方式
   * @default "speaker"
   * @supported weapp, qq, jd
   */
  soundMode?: keyof LivePlayerProps.soundMode
  /** 当跳转到本小程序的其他页面时，是否自动暂停本页面的实时音视频播放
   * @default true
   * @supported weapp, qq
   */
  autoPauseIfNavigate?: boolean
  /** 设置小窗模式： push, pop，空字符串或通过数组形式设置多种模式（如： ["push", "pop"]）
   * @supported weapp
   */
  pictureInPictureMode?: ('push' | 'pop')[] | 'push' | 'pop' | ''
  /** 当跳转到其它微信原生页面时，是否自动暂停本页面的实时音视频播放
   * @default true
   * @supported weapp, qq
   */
  autoPauseIfOpenNative?: boolean
  /** 格式固定为 https://servicewechat.com/{appid}/{version}/page-frame.html ，其中 {appid} 为小程序的 appid，{version} 为小程序的版本号，版本号为 0 表示为开发版、体验版以及审核版本，版本号为 devtools 表示为开发者工具，其余为正式版本；
   * @default 'no-referrer'
   * @supported weapp
   */
  referrerPolicy?: 'origin' | 'no-referrer'
  /** 设置署名水印
   * @supported tt
   */
  signature?: string
  /** 是否回调metadata
   * @supported qq
   */
  enableMetadata?: string
  /** live-player 属性的唯一标志符
   * @supported swan
   */
  id?: string
  /** 是否开启手机横屏时自动全屏，当系统设置开启自动旋转时生效
   * @supported weapp
   * @default false
   */
  enableAutoRotation?: boolean
  /** 是否支持投屏。开启后，可以通过 LivePlayerContext 上相关方法进行操作。
   * @supported weapp
   * @default false
   */
  enableCasting?: boolean
  /** 播放状态变化事件，detail = {code}
   * @supported weapp, swan, tt, qq, jd
   */
  onStateChange?: CommonEventFunction<LivePlayerProps.onStateChangeEventDetail>
  /** 全屏变化事件，detail = {direction, fullScreen}
   * @supported weapp, swan, tt, qq, jd
   */
  onFullScreenChange?: CommonEventFunction<LivePlayerProps.onFullScreenChangeEventDetail>
  /** 网络状态通知，detail = {info}
   * @supported weapp, swan, qq
   */
  onNetStatus?: CommonEventFunction<LivePlayerProps.onNetStatusEventDetail>
  /** 播放音量大小通知，detail = {}
   * @supported weapp
   */
  onAudioVolumeNotify?: CommonEventFunction<{}>
  /** 播放器进入小窗
   * @supported weapp
   */
  onEnterPictureInPicture?: CommonEventFunction
  /** 播放器退出小窗
   * @supported weapp
   */
  onLeavePictureInPicture?: CommonEventFunction
  /** 播放错误事件
   * @supported tt
   */
  onError?: CommonEventFunction
  /** metadata通知，detail = {info}
   * @supported qq
   */
  onMetaDataChange?: CommonEventFunction
  /** 用户选择投屏设备时触发 detail = { state: "success"/"fail" }
   * @supported weapp
   */
  onCastingUserSelect?: CommonEventFunction<{
    state: 'success' | 'fail'
  }>
  /** 投屏成功/失败时触发 detail = { type, state: "success"/"fail" }
   * @supported weapp
   */
  onCastingStateChange?: CommonEventFunction<{
    type: any
    state: 'success' | 'fail'
  }>
  /** 投屏被中断时触发
   * @supported weapp
   */
  onCastingInterrupt?: CommonEventFunction
}
declare namespace LivePlayerProps {
  /** mode 的合法值 */
  interface Mode {
    /** 直播 */
    live
    /** 实时通话，该模式时延更低 */
    RTC
  }
  /** orientation 的合法值 */
  interface Orientation {
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
    info: NetStatus
  }
  /** 状态码 */
  interface Status {
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
 * @supported weapp, swan, tt, qq, jd
 * @example_react
 * ```tsx
 * class App extends Components {
 *   render () {
 *     return (
 *       <LivePlayer src='url' mode='live' autoplay  />
 *     )
 *   }
 * }
 * ```
 * @example_vue
 * ```html
 * <template>
 *   <live-player src="url" mode="live" :autoplay="true"  />
 * </template>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/live-player.html
 */
declare const LivePlayer: ComponentType<LivePlayerProps>
export { LivePlayer, LivePlayerProps }
