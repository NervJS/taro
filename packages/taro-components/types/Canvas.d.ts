import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction, CanvasTouchEventFunction, CanvasTouchEvent } from './common'
interface CanvasProps extends StandardProps<any, CanvasTouchEvent> {
  /** 指定 canvas 类型，支持 2d 和 webgl
   * @supported weapp, alipay, tt
   */
  type?: string
  /** canvas 组件的唯一标识符，若指定了 type 则无需再指定该属性
   * @supported weapp, swan, tt, qq, jd, h5
   */
  canvasId?: string
  /** 当在 canvas 中移动时且有绑定手势事件时，禁止屏幕滚动以及下拉刷新
   * @default false
   * @supported weapp, alipay, swan, qq, jd
   */
  disableScroll?: boolean
  /** 组件唯一标识符。
   * 注意：同一页面中的 id 不可重复。
   * @supported alipay, h5
   */
  id?: string
  /**
   * @supported alipay, h5
   */
  width?: string
  /**
   * @supported alipay, h5
   */
  height?: string
  /** 用于透传 `WebComponents` 上的属性到内部 H5 标签上
   * @supported h5
   */
  nativeProps?: Record<string, unknown>
  /** 手指触摸动作开始
   * @supported weapp, alipay, swan, tt, qq, jd, h5
   */
  onTouchStart?: CanvasTouchEventFunction
  /** 手指触摸后移动
   * @supported weapp, alipay, swan, tt, qq, jd, h5
   */
  onTouchMove?: CanvasTouchEventFunction
  /** 手指触摸动作结束
   * @supported weapp, alipay, swan, tt, qq, jd, h5
   */
  onTouchEnd?: CanvasTouchEventFunction
  /** 手指触摸动作被打断，如来电提醒，弹窗
   * @supported weapp, alipay, swan, tt, qq, jd, h5
   */
  onTouchCancel?: CanvasTouchEventFunction
  /** 手指长按 500ms 之后触发，触发了长按事件后进行移动不会触发屏幕的滚动
   * @supported weapp, alipay, swan, qq, jd, h5
   */
  onLongTap?: CommonEventFunction
  /** 当发生错误时触发 error 事件，detail = {errMsg: 'something wrong'}
   * @supported weapp, swan, qq, jd
   */
  onError?: CommonEventFunction<CanvasProps.onErrorEventDetail>
  /** 点击。
   * @supported alipay
   */
  onTap?: CommonEventFunction
  /** canvas 组件初始化成功触发。
   * @supported alipay
   */
  onReady?: CommonEventFunction
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
 * @supported weapp, alipay, swan, tt, qq, jd, h5
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
