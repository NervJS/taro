import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

export interface ScrollViewProps extends StandardProps {

  /**
   * 允许横向滚动
   *
   * 默认值：`fasle`
   */
  scrollX?: boolean,

  /**
   * 允许纵向滚动
   *
   * 默认值：`false`
   */
  scrollY?: boolean,

  /**
   * 距顶部/左边多远时（单位px），触发 scrolltoupper 事件
   *
   * 默认值：`50`
   */
  upperThreshold?: number,

  /**
   * 距底部/右边多远时（单位px），触发 scrolltolower 事件
   *
   * 默认值：`50`
   */
  lowerThreshold?: number,

  /**
   * 设置竖向滚动条位置
   */
  scrollTop?: number,

  /**
   * 设置横向滚动条位置
   */
  scrollLeft?: number,

  /**
   * 值应为某子元素id（id不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素
   */
  scrollIntoView?: string,

  /**
   * iOS点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只支持竖向
   *
   * 默认值：`false`
   */
  enableBackToTop?: boolean,

  /**
   * 在设置滚动条位置时使用动画过渡
   *
   * 默认值：`fasle`
   */
  scrollWithAnimation?: boolean,

  /**
   * 滚动到顶部/左边，会触发 scrolltoupper 事件
   */
  onScrollToUpper?: (event: CommonEventFunction) => any,

  /**
   * 滚动到底部/右边，会触发 scrolltolower 事件
   */
  onScrollToLower?: (event: CommonEventFunction) => any,

  /**
   * 滚动时触发
   *
   * `event.detail = {scrollLeft, scrollTop, scrollHeight, scrollWidth, deltaX, deltaY}`
   */
  onScroll?: (event: CommonEventFunction) => any
}

declare const ScrollView: ComponentType<ScrollViewProps>

export {
  ScrollView
}
