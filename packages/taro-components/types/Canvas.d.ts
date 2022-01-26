import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction, CanvasTouchEventFunction, CanvasTouchEvent } from './common'

interface CanvasProps extends StandardProps<any, CanvasTouchEvent> {
  /** 指定 canvas 类型，支持 2d 和 webgl
   * @supported weapp
   */
  type?: string

  /** canvas 组件的唯一标识符，若指定了 type 则无需再指定该属性
   * @supported weapp
   */
  canvasId?: string

  /** 当在 canvas 中移动时且有绑定手势事件时，禁止屏幕滚动以及下拉刷新
   * @default false
   * @supported weapp
   */
  disableScroll?: boolean

  /** 手指触摸动作开始
   * @supported weapp
   */
  onTouchStart?: CanvasTouchEventFunction

  /** 手指触摸后移动
   * @supported weapp
   */
  onTouchMove?: CanvasTouchEventFunction

  /** 手指触摸动作结束
   * @supported weapp
   */
  onTouchEnd?: CanvasTouchEventFunction

  /** 手指触摸动作被打断，如来电提醒，弹窗
   * @supported weapp
   */
  onTouchCancel?: CanvasTouchEventFunction

  /** 手指长按 500ms 之后触发，触发了长按事件后进行移动不会触发屏幕的滚动
   * @supported weapp
   */
  onLongTap?: CommonEventFunction

  /** 当发生错误时触发 error 事件，detail = {errMsg: 'something wrong'}
   * @supported weapp
   */
  onError?: CommonEventFunction<CanvasProps.onErrorEventDetail>

  /** 用于透传 `WebComponents` 上的属性到内部 H5 标签上
   * @supported h5
   */
  nativeProps?: Record<string, unknown>
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
 * @example_react
 * ```tsx
 * class App extends Components {
 *   render () {
 *     // 如果是支付宝小程序，则要加上 id 属性，值和canvasId一致
 *     return (
 *       <Canvas style='width: 300px; height: 200px;' canvasId='canvas' />
 *     )
 *   }
 * }
 * ```
 * @example_vue
 * ```html
 * <template>
 *   <!-- 如果是支付宝小程序，则要加上 id 属性，值和canvasId一致 -->
 *   <canvas style="width: 300px; height: 200px;" canvas-id="canvas" />
 * </template>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html
 */
declare const Canvas: ComponentType<CanvasProps>

export { Canvas, CanvasProps }
