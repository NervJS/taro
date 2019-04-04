import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

export interface CanvasProps extends StandardProps {

  width: number | string,

  height: number | string

  /**
   * canvas 组件的唯一标识符
   */
  canvasId: string,

  /**
   * 当在 canvas 中移动时且有绑定手势事件时，禁止屏幕滚动以及下拉刷新
   *
   * 默认值：`false`
   */
  disableScroll?: boolean,

  /**
   * 当发生错误时触发 error 事件
   *
   * detail = {errMsg: 'something wrong'}
   */
  onError?: CommonEventFunction
}

declare const Canvas: ComponentType<CanvasProps>

export { Canvas }
