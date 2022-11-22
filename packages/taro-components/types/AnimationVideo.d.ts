import { ComponentType } from 'react'
import { StandardProps } from './common'
interface AnimationVideoProps extends StandardProps {
  /** 组件使用的 video 视频资源的宽度（单位：px）
   * @supported swan
   * @default 800
   */
  resourceWidth?: number

  /** 组件使用的 video 视频资源的高度（单位：px）
   * @supported swan
   * @default 400
   */
  resourceHeight?: number

  /** 用于设置动画画布的 CSS 样式
   * @supported swan
   * @default "width: 400px;height: 400px"
   */
  canvasStyle?: string

  /** 动画资源地址，支持相对路径以及远程地址。如果是远程路径，注意 response header 里需要设置 Access-Control-Allow-Origin 来防止跨域问题
   * @supported swan
   */
  path?: string

  /** 动画是否循环播放
   * @supported swan
   * @default false
   */
  loop?: boolean

  /** 动画是否自动播放
   * @supported swan
   * @default false
   */
  autoplay?: boolean

  /** 视频资源中 alpha 通道的方向，left 表示 alpha 通道在资源的左边，right 表示 alpha 通道在资源的右边。详情请参考透明视频设计资源示例
   * @supported swan
   * @default "left"
   */
  alphaDirection?: string

  /** 动画开始播放的回调
   * @supported swan
   */
  onStarted?: CommonEventFunction

  /** 当播放到末尾时触发 ended 事件（自然播放结束会触发回调，循环播放结束及暂停动画不会触发）
   * @supported swan
   */
  onEnded?: CommonEventFunction
}

/** 透明视频动画
 * @classification media
 * @supported swan
 * @see https://smartprogram.baidu.com/docs/develop/component/animation-video/
 */
declare const AnimationVideo: ComponentType<AnimationVideoProps>
export { AnimationVideo, AnimationVideoProps }
