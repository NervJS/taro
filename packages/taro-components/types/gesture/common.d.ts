import { ComponentType } from 'react'

import { StandardProps } from '../common'

export interface CommonGestureProps {
  /** 声明手势协商时的组件标识
   * @supported weapp-skyline
   */
  tag?: string
  /** 手势识别成功的回调
   * @supported weapp-skyline
   */
  onGestureWorklet?: string
  /** 手势是否应该被识别
   * @supported weapp-skyline
   */
  shouldAcceptGestureWorklet?: string
  /** 声明可同时触发的手势节点
   * @supported weapp-skyline
   */
  simultaneousHandlers?: string[]
  /** 代理的原生节点类型
   * @supported weapp-skyline
   */
  nativeView?: string
}
