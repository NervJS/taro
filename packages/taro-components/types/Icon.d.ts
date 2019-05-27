import { ComponentType } from 'react'
import { StandardProps } from './common'

export interface IconProps extends StandardProps {

  /**
   * icon的类型，有效类型：
   *
   * 'success' | 'success_no_circle' | 'info' | 'warn' | 'waiting' | 'cancel' | 'download' | 'search' | 'clear'
   */
  type: 'success' | 'success_no_circle' | 'info' | 'warn' | 'waiting' | 'cancel' | 'download' | 'search' | 'clear'

  /**
   * icon的大小，单位px
   *
   * 默认值：`23`
   */
  size?: string,

  /**
   * icon的颜色，同css的color
   *
   */
  color?: string
}

declare const Icon: ComponentType<IconProps>

export { Icon }
