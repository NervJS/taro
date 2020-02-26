import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

interface CanvasProps extends StandardProps {
  /** canvas 组件的唯一标识符
   */
  canvasId: string

  /** 小程序 canvas 组件使用webgl，需要添加type="webgl"，才能通过 SelectorQuery 取到 canvas 节点
   */
  type?: string

  /** 当在 canvas 中移动时且有绑定手势事件时，禁止屏幕滚动以及下拉刷新
   *
   * 默认值：`false`
   */
  disableScroll?: boolean

  /** 当发生错误时触发 error 事件
   *
   * detail = {errMsg: 'something wrong'}
   */
  onError?: CommonEventFunction
}

/** 画布
 * @classification canvas
 */
declare const Canvas: ComponentType<CanvasProps>

export { Canvas, CanvasProps }
