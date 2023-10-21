import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'
interface VideoProps extends StandardProps {
  /** 要播放视频的资源地址
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  src: string
  /** 指定视频时长
   * @supported weapp, alipay, qq, h5, rn
   */
  duration?: number
  /** 是否显示默认播放控件（播放/暂停按钮、播放进度、时间）
   * @default true
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  controls?: boolean
  /** 弹幕列表
   * @supported weapp, swan, qq, h5
   */
  danmuList?: any[]
  /** 是否显示弹幕按钮，只在初始化时有效，不能动态变更
   * @default false
   * @supported weapp, swan, qq, h5
   */
  danmuBtn?: boolean
  /** 是否展示弹幕，只在初始化时有效，不能动态变更
   * @default false
   * @supported weapp, swan, qq, h5
   */
  enableDanmu?: boolean
  /** 是否自动播放
   * @default false
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  autoplay?: boolean
  /** 是否循环播放
   * @default false
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  loop?: boolean
  /** 是否静音播放
   * @default false
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  muted?: boolean
  /** 指定视频初始播放位置
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  initialTime?: number
  /** 在非全屏模式下，是否开启亮度与音量调节手势
   * @default false
   * @supported weapp, swan, qq
   */
  pageGesture?: boolean
  /** 设置全屏时视频的方向，不指定则根据宽高比自动判断。有效值为 0（正常竖向）, 90（屏幕逆时针90度）, -90（屏幕顺时针90度）
   * @supported weapp, alipay, swan, tt, qq
   */
  direction?: number
  /** 若不设置，宽度大于240时才会显示
   * @default true
   * @supported weapp, swan, qq, h5
   */
  showProgress?: boolean
  /** 是否显示全屏按钮
   * @default true
   * @supported weapp, alipay, swan, tt, qq, h5
   */
  showFullscreenBtn?: boolean
  /** 是否显示视频底部控制栏的播放按钮
   * @default true
   * @supported weapp, alipay, swan, tt, qq, h5
   */
  showPlayBtn?: boolean
  /** 是否显示视频中间的播放按钮
   * @default true
   * @supported weapp, alipay, swan, qq, h5, rn
   */
  showCenterPlayBtn?: boolean
  /** 是否开启控制进度的手势
   * @default true
   * @supported weapp, alipay, swan, tt, qq, h5
   */
  enableProgressGesture?: boolean
  /** 当视频大小与 video 容器大小不一致时，视频的表现形式
   * @default "contain"
   * @supported weapp, alipay, swan, tt, qq, jd, h5
   */
  objectFit?: keyof VideoProps.ObjectFit
  /** 视频封面的图片网络资源地址，如果 controls 属性值为 false 则设置 poster 无效
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  poster?: string
  /** 是否显示静音按钮
   * @default false
   * @supported weapp, alipay, swan, tt, qq, h5
   */
  showMuteBtn?: boolean
  /** 视频的标题，全屏时在顶部展示
   * @supported weapp, swan, qq
   */
  title?: string
  /** 播放按钮的位置
   * - `bottom`: controls bar 上
   * - `center`: 视频中间
   *
   * @default 'bottom'
   * @supported weapp, tt, qq
   */
  playBtnPosition?: keyof VideoProps.PlayBtnPosition
  /** 是否开启播放手势，即双击切换播放/暂停
   * @default false
   * @supported weapp, swan, tt, qq, h5
   */
  enablePlayGesture?: boolean
  /** 当跳转到其它小程序页面时，是否自动暂停本页面的视频
   * @default true
   * @supported weapp, qq
   */
  autoPauseIfNavigate?: boolean
  /** 当跳转到其它微信原生页面时，是否自动暂停本页面的视频
   * @default true
   * @supported weapp, qq
   */
  autoPauseIfOpenNative?: boolean
  /** 在非全屏模式下，是否开启亮度与音量调节手势（同 `page-gesture`）
   * @default false
   * @supported weapp, swan, tt, h5
   */
  vslideGesture?: boolean
  /** 在全屏模式下，是否开启亮度与音量调节手势
   * @default true
   * @supported weapp, swan, tt, h5
   */
  vslideGestureInFullscreen?: boolean
  /** 视频前贴广告单元ID，更多详情可参考开放能力[视频前贴广告](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/ad/video-patch-ad.html)
   * @supported weapp
   */
  adUnitId?: string
  /** 用于给搜索等场景作为视频封面展示，建议使用无播放 icon 的视频封面图，只支持网络地址
   * @supported weapp
   */
  posterForCrawler?: string
  /** 显示投屏按钮。只安卓且同层渲染下生效，支持 DLNA 协议
   * @supported weapp
   */
  showCastingButton?: boolean
  /**
   * 设置小窗模式： push, pop，空字符串或通过数组形式设置多种模式（如： ["push", "pop"]）
   * @supported weapp
   */
  pictureInPictureMode?: ('push' | 'pop')[] | 'push' | 'pop' | ''
  /**
   * 是否在小窗模式下显示播放进度（目前有bug，先注释掉）
   * @supported weapp
   *
   * 先注释掉，原因如下：
   * 该属性超过了 wxml 属性的长度限制，实际无法使用且导致编译报错。可等微信官方修复后再放开。
   * 参考1：https://developers.weixin.qq.com/community/develop/doc/000a429beb87f0eac07acc0fc5b400
   * 参考2: https://developers.weixin.qq.com/community/develop/doc/0006883619c48054286a4308258c00?_at=vyxqpllafi
   *
   */
  // pictureInPictureShowProgress?: boolean

  /**
   * 是否开启手机横屏时自动全屏，当系统设置开启自动旋转时生效
   * @supported weapp
   */
  enableAutoRotation?: boolean
  /**
   * 是否显示锁屏按钮，仅在全屏时显示，锁屏后控制栏的操作
   * @supported weapp, tt
   */
  showScreenLockButton?: boolean
  /**
   * 是否显示截屏按钮，仅在全屏时显示
   * @supported weapp
   */
  showSnapshotButton?: boolean
  /**
   * 是否展示后台音频播放按钮
   * @supported weapp
   */
  showBackgroundPlaybackButton?: boolean
  /**
   * 进入后台音频播放后的通知栏图标（Android 独有）
   * @supported weapp
   */
  backgroundPoster?: string
  /** 用于透传 `WebComponents` 上的属性到内部 H5 标签上
   * @supported h5
   */
  nativeProps?: Record<string, unknown>
  /** 是否展示底部进度条
   * @supported weapp
   * @default true
   */
  showBottomProgress?: boolean
  /** 是否在小窗模式下显示播放进度
   * @supported weapp
   */
  pictureInPictureShowProgress?: string
  /** 格式固定为 https://servicewechat.com/{appid}/{version}/page-frame.html，其中 {appid} 为小程序的 appid，{version} 为小程序的版本号，版本号为 0 表示为开发版、体验版以及审核版本，版本号为 devtools 表示为开发者工具，其余为正式版本；
   * @supported weapp
   */
  referrerPolicy?: 'origin' | 'no-referrer'
  /** 是否是 DRM 视频源
   * @supported weapp
   */
  isDrm?: boolean
  /** DRM 设备身份认证 url，仅 is-drm 为 true 时生效 (Android)
   * @supported weapp
   */
  provisionUrl?: string
  /** DRM 设备身份认证 url，仅 is-drm 为 true 时生效 (iOS)
   * @supported weapp
   */
  certificateUrl?: string
  /** DRM 获取加密信息 url，仅 is-drm 为 true 时生效
   * @supported weapp
   */
  licenseUrl?: string
  /** 当 poster 高宽比跟视频高宽不匹配时，如何显示 poster，设置规则同 background-size 一致。
   * @supported alipay
   */
  posterSize?: string
  /** 当底部工具条隐藏时，是否显示细进度条（controls=false 时设置无效）。
   * @supported alipay
   */
  showThinProgressBar?: string
  /** 移动网络提醒样式。
   *
   * 0 - 不提醒
   * 1 - tip 提醒
   * 2 - 阻塞提醒(无消耗流量大小)
   * 3 - 阻塞提醒(有消耗流量大小提醒)
   *
   * @supported alipay, jd
   */
  mobilenetHintType?: number
  /** 浮窗设置。暂时不支持全局浮窗。
   * 可选值：
   *
   * none：无浮窗。
   * page：页面内浮窗。
   * @supported alipay
   */
  floatingMode?: string
  /** 非 wifi 环境下是否显示继续播放浮层
   * @supported swan
   */
  showNoWifiTip?: string
  /** 全屏模式下，是否显示锁屏按钮
   * @supported swan
   */
  showLockBtn?: string
  /** 是否显示倍速播放按钮
   * @supported swan
   */
  showRateBtn?: string
  /** 全屏模式下，是否显示侧边栏控制按钮
   * @supported swan
   */
  showVslideBtnInFullscreen?: string
  /** 是否进入无声视频模式，进入无声视频模式后，视频将静音播放且不响应系统物理音量变化，点击播放器提示无声视频，手势调节失效
   * @supported swan
   */
  silentPlay?: string
  /** 前贴广告的 unit id
   * @supported tt
   */
  preRollUnitId?: string
  /** 后贴广告的 unit id
   * @supported tt
   */
  postRollUnitId?: string
  /** 是否显示倍速控件，点击倍速控件后可选择倍速，可选值： 0.75/1.0/1.25/1.5/2
   * @supported tt
   */
  showPlaybackRateBtn?: string
  /** video 播放时宿主退出后台后开启小窗播放，iOS 14 及以上版本支持。开启时首次退出后台后给予弹窗提示用户授权，授权完成后可以到小程序「设置」中重设。支持场景见后台小窗播放
   * @supported tt
   */
  enablePlayInBackground?: string
  /** 设置署名水印
   * @supported tt
   */
  signature?: string
  /** 指定码率上界，单位为比特每秒
   * @supported weapp
   */
  preferredPeakBitRate?: number
  /** 是否为直播源
   * @supported weapp
   */
  isLive?: boolean
  /** 清晰度，设置清晰度列表和默认播放的清晰度。切换清晰度按钮仅在全屏时展示，属性说明详见 Definition 类型说明。需要保证 src 和 definition 中有一个为必填，若同时设置了 src 和 definition，definition 优先级高于 src
   * @supported tt
   */
  definition?: string
  /** 当开始/继续播放时触发 play 事件
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  onPlay?: CommonEventFunction
  /** 当暂停播放时触发 pause 事件
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  onPause?: CommonEventFunction
  /** 当播放到末尾时触发 ended 事件
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  onEnded?: CommonEventFunction
  /** 播放进度变化时触发, 触发频率 250ms 一次
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  onTimeUpdate?: CommonEventFunction<VideoProps.onTimeUpdateEventDetail>
  /** 当视频进入和退出全屏时触发
   *
   * @supported h5, rn
   */
  onFullscreenChange?: CommonEventFunction<VideoProps.onFullscreenChangeEventDetail>
  /** 视频出现缓冲时触发
   *
   * @supported weapp, swan, tt, qq, jd
   */
  onWaiting?: CommonEventFunction<VideoProps.onWaitingEventDetail>
  /** 视频播放出错时触发
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  onError?: CommonEventFunction
  /** 加载进度变化时触发，只支持一段加载
   * @supported weapp, tt, qq, h5
   */
  onProgress?: CommonEventFunction<VideoProps.onProgressEventDetail>
  /** 视频元数据加载完成时触发
   * @supported weapp, swan, tt, jd, rn
   */
  onLoadedMetaData?: CommonEventFunction<VideoProps.onLoadedMetaDataEventDetail>
  /**
   * 播放器进入小窗
   * @supported weapp
   */
  onEnterPictureInPicture?: CommonEventFunction
  /**
   * 播放器退出小窗
   * @supported weapp
   */
  onLeavePictureInPicture?: CommonEventFunction
  /**
   * seek 完成时触发
   * @supported weapp, tt
   */
  onSeekComplete?: CommonEventFunction
  /** 视频进入和退出全屏时触发
   * @supported weapp, alipay, swan, tt, qq, jd
   */
  onFullScreenChange?: CommonEventFunction<VideoProps.onFullscreenChangeEventDetail>
  /** 切换 controls 显示隐藏时触发。
   * @supported weapp, swan
   */
  onControlsToggle?: CommonEventFunction<VideoProps.onControlsToggleEventDetail>
  /** 视频出现缓冲时触发。
   * @supported alipay
   */
  onLoading?: CommonEventFunction
  /** 点击视频 view 时触发
   * @supported alipay
   */
  onTap?: CommonEventFunction<VideoProps.onTapEventDetail>
  /** 用户操作事件
   * @supported alipay
   */
  onUserAction?: CommonEventFunction<VideoProps.onUserActionEventDetail>
  /** 视频播放终止。
   * @supported alipay
   */
  onStop?: CommonEventFunction
  /** 当视频加载完真正开始播放时触发。
   * @supported alipay
   */
  onRenderStart?: CommonEventFunction
  /** 贴片广告开始播放时触发
   * @supported tt
   */
  onAdStart?: CommonEventFunction<VideoProps.onAdTypeCommonEventDetail>
  /** 贴片广告播放结束时触发
   * @supported tt
   */
  onAdEnded?: CommonEventFunction<VideoProps.onAdTypeCommonEventDetail>
  /** 贴片广告非自然结束时触发，如：用户关闭广告或广告播放过程中 video 组件被销毁
   * @supported tt
   */
  onAdClose?: CommonEventFunction<VideoProps.onAdTypeCommonEventDetail>
  /** 贴片广告加载失败时触发
   * @supported tt
   */
  onAdError?: CommonEventFunction<VideoProps.onAdTypeCommonEventDetail>
  /** 视频倍速改变完成时触发。返回改变后的倍速值
   * @supported tt
   */
  onPlayBackRateChange?: CommonEventFunction<{
    playbackRate: string
  }>
  /** 静音状态改变完成时触发。返回当前是否静音
   * @supported tt
   */
  onMuteChange?: CommonEventFunction<{
    isMuted: boolean
  }>
  /** 点击控件时触发。返回当前点击的控件类型
   * @supported tt
   */
  onControlTap?: CommonEventFunction<{
    controlType
  }>
  /** 进入小窗播放时触发
   * @supported tt
   */
  onEnterBackground?: CommonEventFunction
  /** 关闭小窗播放时触发
   * @supported tt
   */
  onCloseBackground?: CommonEventFunction
  /** 离开小窗进入 app 事件时触发
   * @supported tt
   */
  onLeaveBackground?: CommonEventFunction
  /** 否
   * @supported jd
   */
  onLoadedData?: CommonEventFunction
  /** 否
   * @supported jd
   */
  onLoadStart?: CommonEventFunction
  /** 否
   * @supported jd
   */
  onSeeked?: CommonEventFunction
  /** 否
   * @supported jd
   */
  onSeeking?: CommonEventFunction
  /** 贴片广告加载成功时触发，event.detail = { adType: 'preRollAd' | 'postRollAd' }
   * @supported tt
   */
  onAdLoad?: CommonEventFunction
  /** 用户选择投屏设备时触发 detail = { state: "success"/"fail" }
   * @supported weapp
   */
  onCastingUserSelect?: CommonEventFunction
  /** 投屏成功/失败时触发 detail = { type, state: "success"/"fail" }
   * @supported weapp
   */
  onCastingStateChange?: CommonEventFunction
  /** 投屏被中断时触发
   * @supported weapp
   */
  onCastingInterrupt?: CommonEventFunction
}
declare namespace VideoProps {
  /** direction 的合法值 */
  interface direction {
    /** 正常竖向 */
    0
    /** 屏幕逆时针90度 */
    90
    /** 屏幕顺时针90度 */
    '-90'
  }
  /** objectFit 的合法值 */
  interface ObjectFit {
    /** 包含 */
    contain
    /** 填充 */
    fill
    /** 覆盖 */
    cover
  }
  /** playBtnPosition 的合法值 */
  interface PlayBtnPosition {
    /** controls bar上 */
    bottom
    /** 视频中间 */
    center
  }
  interface onTimeUpdateEventDetail {
    /** 当前时间 */
    currentTime: number
    /** 持续时间 */
    duration: number
    /** 用户实际观看时长
     * @supported alipay
     */
    userPlayDuration: number
    /** 视频总时长
     * @supported alipay
     */
    videoDuration: number
  }
  interface onFullscreenChangeEventDetail {
    /** 方向 */
    direction: 'vertical' | 'horizontal'
    /** 全屏 */
    fullScreen: number | boolean
  }
  interface onWaitingEventDetail {
    /** 方向 */
    direction: 'vertical' | 'horizontal'
    /** 全屏 */
    fullScreen: number | boolean
  }
  interface onProgressEventDetail {
    /** 百分比 */
    buffered: number
  }
  interface onLoadedMetaDataEventDetail {
    /** 视频宽度 */
    width: number
    /** 视频高度 */
    height: number
    /** 持续时间 */
    duration: number
  }
  interface onControlsToggleEventDetail {
    /** 是否显示 */
    show: boolean
  }
  interface onTapEventDetail {
    ptInView: {
      x: number
      y: number
    }
  }
  interface onUserActionEventDetail {
    /** 用户操作的元素 */
    tag: keyof UserActionTag | string
    value: number
  }
  interface UserActionTag {
    /** 底部播放按钮 */
    play
    /** 中心播放按钮 */
    centerplay
    /** 静音按钮 */
    mute
    /** 全屏按钮 */
    fullscreen
    /** 重试按钮 */
    retry
    /** 网络提醒的播放按钮 */
    mobilenetplay
  }
  interface onAdTypeCommonEventDetail {
    /** 广告类型 */
    adType: 'preRollAd' | 'postRollAd'
  }
}
/** 视频。相关api：Taro.createVideoContext
 * @classification media
 * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony
 * @example_react
 * ```tsx
 * export default class PageView extends Component {
 *   constructor() {
 *     super(...arguments)
 *   }
 *
 *   render() {
 *     return (
 *       <View className='components-page'>
 *         <Video
 *           id='video'
 *           src='https://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400'
 *           poster='https://misc.aotu.io/booxood/mobile-video/cover_900x500.jpg'
 *           initialTime={0}
 *           controls={true}
 *           autoplay={false}
 *           loop={false}
 *           muted={false}
 *         />
 *       </View>
 *     )
 *   }
 * }
 * ```
 * @example_vue
 * ```html
 * <template>
 *   <video
 *     id="video"
 *     src="https://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400"
 *     poster="https://misc.aotu.io/booxood/mobile-video/cover_900x500.jpg"
 *     initial-time="0"
 *     :controls="true"
 *     :autoplay="false"
 *     :loop="false"
 *     :muted="false"
 *   />
 * </template>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/video.html
 */
declare const Video: ComponentType<VideoProps>
export { Video, VideoProps }
