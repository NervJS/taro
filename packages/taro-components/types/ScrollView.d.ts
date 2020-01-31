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
   * 启用 flexbox 布局。开启后，当前节点声明了 display: flex 就会成为 flex container，并作用于其孩子节点。
   *
   * 默认值：`false`
   */
  enableFlex?: boolean,

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
  onScroll?: (event: CommonEventFunction) => any,

  /**
   * 开启 scroll anchoring 特性，即控制滚动位置不随内容变化而抖动，仅在 iOS 下生效，安卓下可参考 CSS overflow-anchor 属性。
   * 
   * 默认值：`false`
   */
  scrollAnchoring?: boolean;

  /**
   * 开启自定义下拉刷新
   * 
   * 默认值：`false`
   */
  refresherEnabled?: boolean,

  /**
   * 设置自定义下拉刷新阈值
   * 
   * 默认值：`45`
   */
  refresherThreshold?: number,

  /**
   * 设置自定义下拉刷新默认样式，支持设置 black | white | none， none 表示不使用默认样式
   * 
   * 默认值：`black`
   */
  refresherDefaultStyle?: 'black' | 'white' | 'none',

  /**
   * 设置自定义下拉刷新区域背景颜色
   * 
   * 默认值：`#FFF`
   */
  refresherBackground?: string,

  /**
   * 设置当前下拉刷新状态，true 表示下拉刷新已经被触发，false 表示下拉刷新未被触发
   * 
   * 默认值：`false`
   */
  refresherTriggered?: boolean,

  /**
   * 自定义下拉刷新控件被下拉
   */
  onRefresherPulling?: (event: CommonEventFunction) => any,

  /**
   * 自定义下拉刷新被触发
   */
  onRefresherrefresh?: (event: CommonEventFunction) => any,

  /**
   * 自定义下拉刷新被复位
   */
  onRefresherRestore?: (event: CommonEventFunction) => any,

  /**
   * 自定义下拉刷新被中止
   */
  onRefresherAbort?: (event: CommonEventFunction) => any,
}

/**
 * @classification viewContainer
 */
declare const ScrollView: ComponentType<ScrollViewProps>

export {
  ScrollView
}
