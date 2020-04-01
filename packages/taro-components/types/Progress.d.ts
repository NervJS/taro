import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

interface ProgressProps extends StandardProps {
  /** 百分比 0~100
   * @supported weapp, swan, alipay, tt, h5, rn
   */
  percent: number

  /** 在进度条右侧显示百分比
   * @default false
   * @supported weapp, swan, alipay, h5, rn
   */
  showInfo?: boolean

  /** 圆角大小
   * @default 0
   * @supported weapp
   */
  borderRadius?: number

  /** 右侧百分比字体大小，单位 px
   * @default 16
   * @supported weapp
   */
  fontSize?: number

  /** 进度条线的宽度，单位 px
   * @default 6
   * @supported weapp, swan, alipay, tt, h5, rn
   */
  strokeWidth?: number

  /** 进度条颜色 (请使用 activeColor)
   * @default "#09BB07"
   * @supported weapp, swan, alipay, tt
   */
  color?: string

  /** 已选择的进度条的颜色
   * @supported weapp, swan, alipay, tt, h5, rn
   */
  activeColor?: string

  /** 未选择的进度条的颜色
   * @supported weapp, swan, alipay, tt, h5, rn
   */
  backgroundColor?: string

  /** 进度条从左往右的动画
   * @default false
   * @supported weapp, swan, alipay, tt, h5, rn
   */
  active?: boolean

  /** backwards: 动画从头播
   *
   * forwards: 动画从上次结束点接着播
   * @default backwards
   * @supported weapp, swan, tt, rn
   */
  activeMode?: 'backwards' | 'forwards'

  /** 进度增加 1% 所需毫秒数
   * @default 30
   * @supported weapp
   */
  duration?: number

  /** 动画完成事件
   * @supported weapp
   */
  onActiveEnd?: CommonEventFunction
}

/** 进度条。组件属性的长度单位默认为 px
 * @classification base
 * @supported weapp, swan, alipay, tt, h5, rn
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
 *         <Progress percent={20} showInfo strokeWidth={2} />
 *         <Progress percent={40} strokeWidth={2} active />
 *         <Progress percent={60}  strokeWidth={2} active />
 *         <Progress percent={80}  strokeWidth={2} active activeColor='blue' />
 *       </View>
 *     )
 *   }
 * }
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/progress.html
 */
declare const Progress: ComponentType<ProgressProps>

export { Progress, ProgressProps }
