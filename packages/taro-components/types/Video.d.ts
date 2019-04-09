import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

export interface VideoProps extends StandardProps {

  /**
   * 要播放视频的资源地址
   */
  src: string,

  /**
   * 指定视频初始播放位置
   */
  initialTime?: number,

  /**
   * 指定视频时长
   */
  duration?: number,

  /**
   * 是否显示默认播放控件（播放/暂停按钮、播放进度、时间）
   *
   * 默认值：`true`
   */
  controls?: boolean,

  /**
   * 弹幕列表
   */
  danmuList?: any[],

  /**
   * 是否显示弹幕按钮，只在初始化时有效，不能动态变更
   *
   * 默认值：`false`
   */
  danmuBtn?: boolean,

  /**
   * 是否展示弹幕，只在初始化时有效，不能动态变更
   *
   * 默认值：`false`
   */
  enableDanmu?: boolean,

  /**
   * 是否自动播放
   *
   * 默认值：`false`
   */
  autoplay?: boolean,

  /**
   * 是否循环播放
   *
   * 默认值：`false`
   */
  loop?: boolean,

  /**
   * 是否静音播放
   *
   * 默认值：`false`
   */
  muted?: boolean,

  /**
   * 在非全屏模式下，是否开启亮度与音量调节手势
   *
   * 默认值：`false`
   */
  pageGesture?: boolean,

  /**
   * 设置全屏时视频的方向，不指定则根据宽高比自动判断。有效值为 0（正常竖向）, 90（屏幕逆时针90度）, -90（屏幕顺时针90度）
   */
  direction?: number,

  /**
   * 若不设置，宽度大于240时才会显示
   *
   * 默认值：`true`
   */
  showProgress?: boolean,

  /**
   * 是否显示全屏按钮
   *
   * 默认值：`true`
   */
  showFullscreenBtn?: boolean,

  /**
   * 是否显示视频底部控制栏的播放按钮
   *
   * 默认值：`true`
   */
  showPlayBtn?: boolean,

  /**
   * 是否显示视频中间的播放按钮
   *
   * 默认值：`true`
   */
  showCenterPlayBtn?: boolean,

  /**
   * 是否开启控制进度的手势
   *
   * 默认值：`true`
   */
  enableProgressGesture?: boolean,

  /**
   * 当视频大小与 video 容器大小不一致时，视频的表现形式。
   *
   * `contain`：包含，`fill`：填充，`cover`：覆盖
   *
   * 默认值：`contain`
   */
  objectFit?: 'contain' | 'fill' | 'cover',

  /**
   * 视频封面的图片网络资源地址，如果 controls 属性值为 false 则设置 poster 无效
   */
  poster?: string,

  /**
   * 是否显示静音按钮。
   *
   * @default false
   * @since 2.4.0
   */
  showMuteBtn?: boolean,

  /**
   * 视频的标题，全屏时在顶部展示。
   *
   * @since 2.4.0
   */
  title?: string,

  /**
   * 播放按钮的位置。
   *
   * - `bottom`: controls bar 上
   * - `center`: 视频中间
   *
   * @default 'bottom'
   * @since 2.4.0
   */
  playBtnPosition?: 'bottom' | 'center',

  /**
   * 是否开启播放手势，即双击切换播放/暂停。
   *
   * @default false
   * @since 2.4.0
   */
  enablePlayGesture?: boolean,

  /**
   * 当跳转到其它小程序页面时，是否自动暂停本页面的视频。
   *
   * @default true
   * @since 2.5.0
   */
  autoPauseIfNavigate?: boolean,

  /**
   * 当跳转到其它微信原生页面时，是否自动暂停本页面的视频。
   *
   * @default true
   * @since 2.5.0
   */
  autoPauseIfOpenNative?: boolean,

  /**
   * 在非全屏模式下，是否开启亮度与音量调节手势（同 `page-gesture`）。
   *
   * @default false
   * @since 2.6.2
   */
  vslideGesture?: boolean,

  /**
   * 在全屏模式下，是否开启亮度与音量调节手势。
   *
   * @default true
   * @since 2.6.2
   */
  vslideGestureInFullscreen?: boolean,

  /**
   * 当开始/继续播放时触发play事件
   */
  onPlay?: CommonEventFunction,

  /**
   * 当暂停播放时触发 pause 事件
   */
  onPause?: CommonEventFunction,

  /**
   * 当播放到末尾时触发 ended 事件
   */
  onEnded?: CommonEventFunction,

  /**
   * 播放进度变化时触发, 触发频率 250ms 一次
   *
   * event.detail = {currentTime, duration}
   */
  onTimeUpdate?: CommonEventFunction,

  /**
   * 当视频进入和退出全屏是触发
   *
   * event.detail = {fullScreen, direction}，direction取为 vertical 或 horizontal
   */
  onFullscreenChange?: CommonEventFunction,

  /**
   * 当视频进入和退出全屏是触发
   *
   * event.detail = {fullScreen, direction}，direction取为 vertical 或 horizontal
   */
  onWaiting?: CommonEventFunction,
  onError?: CommonEventFunction,
  /**
   * 加载进度变化时触发，只支持一段加载。
   *
   * @since 2.4.0
   */
  onProgress?: CommonEventFunction<{
    /** 百分比 */
    buffered: number,
  }>
}

declare const Video: ComponentType<VideoProps>

export { Video }
