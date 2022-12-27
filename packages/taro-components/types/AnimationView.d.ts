import { ComponentType } from 'react'
import { StandardProps } from './common'
interface AnimationViewProps extends StandardProps {
  /** 动画资源地址，目前只支持绝对路径
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
   * @default true
   */
  autoplay?: boolean

  /** 动画操作，可取值 play、pause、stop
   * @supported swan
   * @default "play"
   */
  action?: 'play' | 'pause' | 'stop'

  /** 是否隐藏动画
   * @supported swan
   * @default true
   */
  hidden?: boolean

  /** 当播放到末尾时触发 ended 事件（自然播放结束会触发回调，循环播放结束及手动停止动画不会触发）
   * @supported swan
   */
  onEnded?: CommonEventFunction
}

/** Lottie 动画
 * @classification media
 * @supported swan
 * @see https://smartprogram.baidu.com/docs/develop/component/animation-view-Lottie/
 */
declare const AnimationView: ComponentType<AnimationViewProps>
export { AnimationView, AnimationViewProps }
