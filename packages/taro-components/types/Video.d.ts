import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

interface VideoProps extends StandardProps {
  /** 要播放视频的资源地址
   * @supported weapp, h5, swan, alipay, tt
   */
  src: string

  /** 指定视频时长
   * @supported weapp, swan, alipay
   * @h5 待定
   */
  duration?: number

  /** 是否显示默认播放控件（播放/暂停按钮、播放进度、时间）
   * @default true
   * @supported weapp, h5, swan, alipay, tt
   */
  controls?: boolean

  /** 弹幕列表
   * @supported weapp, swan
   * @h5 待定
   */
  danmuList?: any[]

  /** 是否显示弹幕按钮，只在初始化时有效，不能动态变更
   * @default false
   * @supported weapp, swan
   * @h5 待定
   */
  danmuBtn?: boolean

  /** 是否展示弹幕，只在初始化时有效，不能动态变更
   * @default false
   * @supported weapp, swan
   * @h5 待定
   */
  enableDanmu?: boolean

  /** 是否自动播放
   * @default false
   * @supported weapp, h5, swan, alipay, tt
   */
  autoplay?: boolean

  /** 是否循环播放
   * @default false
   * @supported weapp, h5, swan, alipay, tt
   */
  loop?: boolean

  /** 是否静音播放
   * @default false
   * @supported weapp, h5, swan, alipay, tt
   */
  muted?: boolean

  /** 指定视频初始播放位置
   * @supported weapp, h5, swan, alipay, tt
   */
  initialTime?: number

  /** 在非全屏模式下，是否开启亮度与音量调节手势
   * @default false
   * @h5 待定
   */
  pageGesture?: boolean

  /** 设置全屏时视频的方向，不指定则根据宽高比自动判断。有效值为 0（正常竖向）, 90（屏幕逆时针90度）, -90（屏幕顺时针90度）
   * @supported weapp, swan, alipay
   * @h5 待定
   */
  direction?: number

  /** 若不设置，宽度大于240时才会显示
   * @default true
   * @supported weapp, swan
   * @h5 待定
   */
  showProgress?: boolean

  /** 是否显示全屏按钮
   * @default true
   * @supported weapp, swan, alipay
   * @h5 待定
   */
  showFullscreenBtn?: boolean

  /** 是否显示视频底部控制栏的播放按钮
   * @default true
   * @supported weapp, swan, alipay
   * @h5 待定
   */
  showPlayBtn?: boolean

  /** 是否显示视频中间的播放按钮
   * @default true
   * @supported weapp, swan, alipay
   * @h5 待定
   */
  showCenterPlayBtn?: boolean

  /** 是否开启控制进度的手势
   * @default true
   * @supported weapp, swan, alipay
   * @h5 待定
   */
  enableProgressGesture?: boolean

  /** 当视频大小与 video 容器大小不一致时，视频的表现形式
   * @default "contain"
   * @supported weapp, swan, alipay
   * @h5 待定
   */
  objectFit?: keyof VideoProps.objectFit

  /** 视频封面的图片网络资源地址，如果 controls 属性值为 false 则设置 poster 无效
   * @supported weapp, h5, swan, alipay, tt
   */
  poster?: string

  /** 是否显示静音按钮
   * @default false
   * @supported weapp
   * @h5 待定
   */
  showMuteBtn?: boolean

  /** 视频的标题，全屏时在顶部展示
   * @supported weapp
   * @h5 待定
   */
  title?: string

  /** 播放按钮的位置
   * - `bottom`: controls bar 上
   * - `center`: 视频中间
   *
   * @default 'bottom'
   * @supported weapp
   * @h5 待定
   */
  playBtnPosition?: keyof VideoProps.playBtnPosition

  /** 是否开启播放手势，即双击切换播放/暂停
   * @default false
   * @supported weapp
   * @h5 待定
   */
  enablePlayGesture?: boolean

  /** 当跳转到其它小程序页面时，是否自动暂停本页面的视频
   * @default true
   * @supported weapp
   * @h5 待定
   */
  autoPauseIfNavigate?: boolean

  /** 当跳转到其它微信原生页面时，是否自动暂停本页面的视频
   * @default true
   * @supported weapp
   * @h5 待定
   */
  autoPauseIfOpenNative?: boolean

  /** 在非全屏模式下，是否开启亮度与音量调节手势（同 `page-gesture`）
   * @default false
   * @supported weapp, swan
   * @h5 待定
   */
  vslideGesture?: boolean

  /** 在全屏模式下，是否开启亮度与音量调节手势
   * @default true
   * @supported weapp
   * @h5 待定
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

  /** 当开始/继续播放时触发 play 事件
   * @supported weapp, h5, swan, alipay, tt
   */
  onPlay?: CommonEventFunction

  /** 当暂停播放时触发 pause 事件
   * @supported weapp, h5, swan, alipay, tt
   */
  onPause?: CommonEventFunction

  /** 当播放到末尾时触发 ended 事件
   * @supported weapp, h5, swan, alipay, tt
   */
  onEnded?: CommonEventFunction

  /** 播放进度变化时触发, 触发频率 250ms 一次
   *
   * event.detail = {currentTime, duration}
   * @supported weapp, h5, swan, alipay, tt
   */
  onTimeUpdate?: CommonEventFunction<VideoProps.onTimeUpdateEventDetail>

  /** 当视频进入和退出全屏是触发
   *
   * event.detail = {fullScreen, direction}，direction取为 vertical 或 horizontal
   * @supported weapp, swan, alipay
   * @h5 待定
   */
  onFullscreenChange?: CommonEventFunction<VideoProps.onFullscreenChangeEventDetail>

  /** 当视频进入和退出全屏是触发
   *
   * event.detail = {fullScreen, direction}，direction 取为 vertical 或 horizontal
   * @supported weapp, swan
   * @h5 待定
   */
  onWaiting?: CommonEventFunction<VideoProps.onWaitingEventDetail>

  /** 视频播放出错时触发
   * @supported weapp, h5, swan, alipay, tt
   */
  onError?: CommonEventFunction
  /** 加载进度变化时触发，只支持一段加载
   * @supported weapp, alipay
   * @h5 待定
   */
  onProgress?: CommonEventFunction<VideoProps.onProgressEventDetail>

  /** 视频元数据加载完成时触发。event.detail = {width, height, duration}
   * @supported weapp
   */
  onLoadedMetaData?: CommonEventFunction
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
  interface objectFit {
    /** 包含 */
    contain
    /** 填充 */
    fill
    /** 覆盖 */
    cover
  }
  /** playBtnPosition 的合法值 */
  interface playBtnPosition {
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
  }
  interface onFullscreenChangeEventDetail {
    /** 方向 */
    direction: number
    /** 全屏 */
    fullScreen: number | boolean
  }
  interface onWaitingEventDetail {
    /** 方向 */
    direction: number
    /** 全屏 */
    fullScreen: number | boolean
  }
  interface onProgressEventDetail {
    /** 百分比 */
    buffered: number
  }
}

/** 视频。相关api：Taro.createVideoContext
 * 
 * 备注：h5上因为没有测试，所以暂时写了“待定”，需要`Video`来确认。
 * @classification media
 * @supported weapp, h5, swan, alipay, tt
 * @example
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
 *           src='http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400'
 *           controls={true}
 *           autoplay={false}
 *           poster='http://misc.aotu.io/booxood/mobile-video/cover_900x500.jpg'
 *           initialTime='0'
 *           id='video'
 *           loop={false}
 *           muted={false}
 *         />
 *       </View>
 *     )
 *   }
 * }
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/video.html
 */
declare const Video: ComponentType<VideoProps>

export { Video, VideoProps }
