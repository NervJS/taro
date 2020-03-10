import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

interface CanvasProps extends StandardProps {
  /** 指定 canvas 类型，支持 2d 和 webgl
   * @supported weapp
   */
  type?: string

  /** canvas 组件的唯一标识符，若指定了 type 则无需再指定该属性
   * @supported weapp
   */
  canvasId: string

  /** 当在 canvas 中移动时且有绑定手势事件时，禁止屏幕滚动以及下拉刷新
   * @default false
   * @supported weapp
   */
  disableScroll?: boolean

  /** 手指触摸动作开始
   * @supported weapp
   */
  onTouchStart: CommonEventFunction

  /** 手指触摸后移动
   * @supported weapp
   */
  onTouchMove: CommonEventFunction

  /** 手指触摸动作结束
   * @supported weapp
   */
  onTouchEnd: CommonEventFunction

  /** 手指触摸动作被打断，如来电提醒，弹窗
   * @supported weapp
   */
  onTouchCancel: CommonEventFunction

  /** 手指长按 500ms 之后触发，触发了长按事件后进行移动不会触发屏幕的滚动
   * @supported weapp
   */
  onLongTap: CommonEventFunction

  /** 当发生错误时触发 error 事件，detail = {errMsg: 'something wrong'}
   * @supported weapp
   */
  onError?: CommonEventFunction<CanvasProps.onErrorEventDetail>
}

declare namespace CanvasProps {
  interface onErrorEventDetail {
    errMsg: string
  }
}

/** 画布
 * 
 * `<Canvas />` 组件的 RN 版本尚未实现。
 * @classification canvas
 * @supported weapp
 * @example
 * ```tsx
 * class App extends Components {
 *   render () {
 *     return (
 *       <Canvas style='width: 300px; height: 200px;' canvasId='canvas' />
 *     )
 *   }
 * }
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html
 */
declare const Canvas: ComponentType<CanvasProps>

export { Canvas, CanvasProps }
