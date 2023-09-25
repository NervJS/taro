import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction, NetStatus } from './common'
/** 实时音视频录制。
 * 需要用户授权 scope.camera、scope.record
 * 暂只针对国内主体如下类目的小程序开放，需要先通过类目审核，再在小程序管理后台，“设置”-“接口设置”中自助开通该组件权限。
 */
interface LivePusherProps extends StandardProps {
  /** 推流地址。目前仅支持 rtmp 格式
   * @supported weapp, qq
   */
  url?: string
  /** SD（标清）, HD（高清）, FHD（超清）, RTC（实时通话）
   * @default "RTC"
   * @supported weapp, qq
   */
  mode?: 'SD' | 'HD' | 'FHD' | 'RTC'
  /** 自动推流
   * @default false
   * @supported weapp, qq
   */
  autopush?: boolean
  /** 自定义渲染，允许开发者自行处理所采集的视频帧
   * @default false
   * @supported weapp
   */
  enableVideoCustomRender?: boolean
  /** 是否静音。即将废弃，可用 enable-mic 替代
   * @default false
   * @deprecated
   * @supported weapp, qq
   */
  muted?: boolean
  /** 开启摄像头
   * @default true
   * @supported weapp, qq
   */
  enableCamera?: boolean
  /** 自动聚集
   * @default true
   * @supported weapp, qq
   */
  autoFocus?: boolean
  /** 画面方向
   * @default "vertical"
   * @supported weapp, qq
   */
  orientation?: keyof LivePusherProps.Orientation
  /** 美颜，取值范围 0-9 ，0 表示关闭
   * @default 0
   * @supported weapp, qq
   */
  beauty?: number
  /** 美白，取值范围 0-9 ，0 表示关闭
   * @default 0
   * @supported weapp, qq
   */
  whiteness?: number
  /** 宽高比，可选值有 3:4, 9:16
   * @default "9:16"
   * @supported weapp, qq
   */
  aspect?: '9:16' | '3:4'
  /** 最小码率
   * @default 200
   * @supported weapp, qq
   */
  minBitrate?: number
  /** 最大码率
   * @default 1000
   * @supported weapp, qq
   */
  maxBitrate?: number
  /** 高音质(48KHz)或低音质(16KHz)，值为high, low
   * @default "high"
   * @supported weapp, qq
   */
  audioQuality?: string
  /** 进入后台时推流的等待画面
   * @supported weapp, qq
   */
  waitingImage?: string
  /** 等待画面资源的MD5值
   * @supported weapp, qq
   */
  waitingImageHash?: string
  /** 调整焦距
   * @default false
   * @supported weapp, qq
   */
  zoom?: boolean
  /** 前置或后置，值为front, back
   * @default "front"
   * @supported weapp, qq
   */
  devicePosition?: string
  /** 进入后台时是否静音
   * @default false
   * @supported weapp, qq
   */
  backgroundMute?: boolean
  /** 设置推流画面是否镜像，产生的效果在 LivePlayer 反应到
   * @default false
   * @supported weapp, qq
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
  localMirror?: keyof LivePusherProps.LocalMirror
  /** 音频混响类型
   * @default 0
   * @supported weapp, qq
   */
  audioReverbType?: keyof LivePusherProps.AudioReverbType
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
  audioVolumeType?: keyof LivePusherProps.AudioVolumeType
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
  /** 设置美颜类型
   * @default smooth
   * @supported weapp
   */
  beautyStyle?: keyof LivePusherProps.BeautyStyleType
  /** 设置色彩滤镜
   * @default standard
   * @supported weapp
   */
  filter?: keyof LivePusherProps.FilterType
  /** 设置小窗模式： push, pop，空字符串或通过数组形式设置多种模式（如： ["push", "pop"]）
   * @supported weapp
   */
  pictureInPictureMode?: string | any[]
  /** 是否启动自定义特效，设定后不能更改
   * @supported weapp
   * @default false
   */
  customEffect?: boolean
  /** 自定义特效美白效果，取值 0~1。需要开启 custom-effect
   * @supported weapp
   * @default 0
   */
  skinWhiteness?: number
  /** 自定义特效磨皮效果，取值 0~1。需要开启 custom-effect
   * @supported weapp
   * @default 0
   */
  skinSmoothness?: number
  /** 自定义特效瘦脸效果，取值 0~1。需要开启 custom-effect
   * @supported weapp
   * @default 0
   */
  faceThinness?: number
  /** 自定义特效大眼效果，取值 0~1。需要开启 custom-effect
   * @supported weapp
   * @default 0
   */
  eyeBigness?: number
  /** 0：关闭变声；1：熊孩子；2：萝莉；3：大叔；4：重金属；6：外国人；7：困兽；8：死肥仔；9：强电流；10：重机械；11：空灵
   * @supported weapp
   * @default 0
   */
  voiceChangerType?: number
  /** 帧率，有效值为 1~30
   * @supported weapp
   * @default 15
   */
  fps?: number
  /** 状态变化事件，detail = {code}
   * @supported weapp, qq
   */
  onStateChange?: CommonEventFunction<LivePusherProps.onStateChangeEventDetail>
  /** 渲染错误事件，detail = {errMsg, errCode}
   * @supported weapp, qq
   */
  onError?: CommonEventFunction<LivePusherProps.onErrorEventDetail>
  /** 背景音进度变化时触发，detail = {progress, duration}
   * @supported weapp, qq
   */
  onBgmProgress?: CommonEventFunction<LivePusherProps.onBgmProgressEventDetail>
  /** 背景音播放完成时触发
   * @supported weapp, qq
   */
  onBgmComplete?: CommonEventFunction
  /** 返回麦克风采集的音量大小
   * @supported weapp
   */
  onAudioVolumeNotify?: CommonEventFunction
  /** 网络状态通知，detail = {info}
   * @supported weapp, qq
   */
  onNetStatus?: CommonEventFunction
  /** 进入小窗
   * @supported weapp
   */
  onEnterPictureInPicture?: string
  /** 退出小窗
   * @supported weapp
   */
  onLeavePictureInPicture?: string
  /** 背景音开始播放时触发
   * @supported weapp, qq
   */
  onBgmStart?: CommonEventFunction
}
declare namespace LivePusherProps {
  /** orientation 的合法值 */
  interface Orientation {
    /** 竖直 */
    vertical
    /** 水平 */
    horizontal
  }
  /** localMirror 的合法值 */
  interface LocalMirror {
    /** 前置摄像头镜像，后置摄像头不镜像 */
    auto
    /** 前后置摄像头均镜像 */
    enable
    /** 前后置摄像头均不镜像 */
    disable
  }
  /** audioReverbType 的合法值 */
  interface AudioReverbType {
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
  interface AudioVolumeType {
    /** 自动 */
    auto
    /** 媒体音量 */
    media
    /** 通话音量 */
    voicecall
  }
  /** beautyStyleType 的合法值 */
  interface BeautyStyleType {
    /** 光滑美颜 */
    smooth
    /** 自然美颜 */
    nature
  }
  /** filterType 的合法值 */
  interface FilterType {
    /** 标准 */
    standard
    /** 粉嫩 */
    pink
    /** 怀旧 */
    nostalgia
    /** 蓝调 */
    blues
    /** 浪漫 */
    romantic
    /** 清凉 */
    cool
    /** 清新 */
    fresher
    /** 日系 */
    solor
    /** 唯美 */
    aestheticism
    /** 美白 */
    whitening
    /** 樱红 */
    cerisered
  }
  interface onStateChangeEventDetail {
    /** 状态码 */
    code: number
  }
  interface onNetstatusEventDetail {
    /** 网络状态 */
    info: NetStatus
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
 * 需要先通过类目审核，再在小程序管理后台，「开发」-「接口设置」中自助开通该组件权限。
 * @classification media
 * @supported weapp, qq
 * @example_react
 * ```tsx
 * class App extends Components {
 *   render () {
 *     return (
 *       <LivePusher url='url' mode='RTC' autopush  />
 *     )
 *   }
 * }
 * ```
 * @example_vue
 * ```html
 * <template>
 *   <live-pusher url="url" mode="RTC" :autopush="true"  />
 * </template>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/live-pusher.html
 */
declare const LivePusher: ComponentType<LivePusherProps>
export { LivePusher, LivePusherProps }
