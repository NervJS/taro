import { ComponentType } from 'react'
import { StandardProps } from './common'

interface PanGestureHandlerProps extends StandardProps {
  /**
   * 声明手势协商时的组件标识
   * @supported weapp
   */
  tag?: string
  /**
   * 声明可同时触发的手势节点
   * @supported weapp
   */
  simultaneousHandlers?: string[]
  /**
   * 代理的原生节点类型
   * @supported weapp
   */
  nativeView?: string
}

/**
 * 拖动（横向/纵向）时触发手势
 * @classification skyline
 * @supported weapp
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/pan-gesture-handler.html
 */
declare const PanGestureHandler: ComponentType<PanGestureHandlerProps>
export { PanGestureHandler, PanGestureHandlerProps }
