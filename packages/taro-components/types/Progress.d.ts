import { ComponentType } from 'react'
import { StandardProps } from './common'

export interface ProgressProps extends StandardProps {

  /**
   * 百分比0~100
   *
   * 默认值：`无`
   */
  percent: number,

  /**
   * 在进度条右侧显示百分比
   *
   * 默认值：`false`
   */
  showInfo?: boolean,

  /**
   * 进度条线的宽度，单位px
   *
   * 默认值：`6`
   */
  strokeWidth?: number,

  /**
   * 进度条颜色 （请使用 activeColor）
   *
   * 默认值：`#09BB07`
   */
  color?: string,

  /**
   * 已选择的进度条的颜色
   */
  activeColor?: string,

  /**
   * 未选择的进度条的颜色
   */
  backgroundColor?: string,

  /**
   * 进度条从左往右的动画
   *
   * 默认值：`false`
   */
  active?: boolean,

  /**
   * backwards: 动画从头播
   *
   * forwards：动画从上次结束点接着播
   *
   * 默认值：`backwards`
   */
  activeMode?: 'backwards' | 'forwards'


  /**
   * 圆角大小
   * 
   * 默认值：0
   */
  borderRadius?: number
}

declare const Progress: ComponentType<ProgressProps>

export { Progress }
