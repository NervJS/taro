import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction, BaseEventOrigFunction } from './common'

interface ScrollViewProps extends StandardProps {
  /** 允许横向滚动
   * @default false
   * @supported weapp, swan, alipay, tt, h5, rn
   * @rn 二选一
   */
  scrollX?: boolean

  /** 允许纵向滚动
   * @default false
   * @supported weapp, swan, alipay, tt, h5, rn
   * @rn 二选一
   */
  scrollY?: boolean

  /** 距顶部/左边多远时（单位px），触发 scrolltoupper 事件
   * @default 50
   * @supported weapp, swan, alipay, tt, h5, rn
   */
  upperThreshold?: number

  /** 距底部/右边多远时（单位px），触发 scrolltolower 事件
   * @default 50
   * @supported weapp, swan, alipay, tt, h5, rn
   */
  lowerThreshold?: number

  /** 设置竖向滚动条位置
   * @supported weapp, swan, alipay, tt, h5, rn
   */
  scrollTop?: number

  /** 设置横向滚动条位置
   * @supported weapp, swan, alipay, tt, h5, rn
   */
  scrollLeft?: number

  /** 值应为某子元素id（id不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素
   * @supported weapp, swan, alipay, tt, h5
   */
  scrollIntoView?: string

  /** 在设置滚动条位置时使用动画过渡
   * @supported weapp, swan, alipay, tt, h5, rn
   * @default false
   */
  scrollWithAnimation?: boolean

  /** iOS 点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只支持竖向
   * @supported weapp, alipay, rn
   * @default false
   */
  enableBackToTop?: boolean

  /** 启用 flexbox 布局。开启后，当前节点声明了 `display: flex` 就会成为 flex container，并作用于其孩子节点。
   * @supported weapp
   * @default false
   */
  enableFlex?: boolean

  /** 开启 scroll anchoring 特性，即控制滚动位置不随内容变化而抖动，仅在 iOS 下生效，安卓下可参考 CSS `overflow-anchor` 属性。
   * @supported weapp
   * @default false
   */
  scrollAnchoring?: boolean

  /** 开启自定义下拉刷新
   * @supported weapp
   * @default false
   */
  refresherEnabled?: boolean

  /** 设置自定义下拉刷新阈值
   * @supported weapp
   * @default 45
   */
  refresherThreshold?: number

  /** 设置自定义下拉刷新默认样式，支持设置 `black | white | none`， none 表示不使用默认样式
   * @supported weapp
   * @default 'black'
   */
  refresherDefaultStyle?: string

  /** 设置自定义下拉刷新区域背景颜色
   * @supported weapp
   * @default '#FFF'
   */
  refresherBackground?: string

  /** 设置当前下拉刷新状态，true 表示下拉刷新已经被触发，false 表示下拉刷新未被触发
   * @supported weapp
   * @default false
   */
  refresherTriggered?: boolean

  /** 启用 scroll-view 增强特性
   * @supported weapp 2.12.0+
   * @default false
   */
  enhanced?: boolean

  /** iOS 下 scroll-view 边界弹性控制 (同时开启 enhanced 属性后生效)
   * @supported weapp 2.12.0+
   * @default true
   */
  bounces?: boolean

  /** 滚动条显隐控制 (同时开启 enhanced 属性后生效)
   * @supported weapp 2.12.0+
   * @default true
   */
  showScrollbar?: boolean

  /** 分页滑动效果 (同时开启 enhanced 属性后生效)
   * @supported weapp 2.12.0+
   * @default false
   */
  pagingEnabled?: boolean

  /** boolean	false	滑动减速速率控制 (同时开启 enhanced 属性后生效)
   * @supported weapp 2.12.0+
   * @default false
   */
  fastDeceleration?: boolean

  /** 滚动到顶部/左边，会触发 scrolltoupper 事件
   * @supported weapp, swan, alipay, tt, h5, rn
   */
  onScrollToUpper?: CommonEventFunction

  /** 滚动到底部/右边，会触发 scrolltolower 事件
   * @supported weapp, swan, alipay, tt, h5, rn
   */
  onScrollToLower?: CommonEventFunction

  /** 滚动时触发
   * `event.detail = {scrollLeft, scrollTop, scrollHeight, scrollWidth, deltaX, deltaY}`
   * @supported weapp, swan, alipay, tt, h5, rn
   */
  onScroll?: BaseEventOrigFunction<ScrollViewProps.onScrollDetail>

  /** 自定义下拉刷新控件被下拉
   * @supported weapp
   */
  onRefresherPulling?: CommonEventFunction

  /** 自定义下拉刷新被触发
   * @supported weapp
   */
  onRefresherRefresh?: CommonEventFunction

  /** 自定义下拉刷新被复位
   * @supported weapp
   */
  onRefresherRestore?: CommonEventFunction

  /** 自定义下拉刷新被中止
   * @supported weapp
   */
  onRefresherAbort?: CommonEventFunction

  /** 滑动开始事件 (同时开启 enhanced 属性后生效)
   * @supported weapp 2.12.0+
   */
  onDragStart?: CommonEventFunction

  /** 滑动事件 (同时开启 enhanced 属性后生效)
   * @supported weapp 2.12.0+
   */
  onDragging?: CommonEventFunction

  /** 滑动结束事件 (同时开启 enhanced 属性后生效)
   * @supported weapp 2.12.0+
   */
  onDragEnd?: CommonEventFunction
}

declare namespace ScrollViewProps {
  interface onScrollDetail {
    /** 横向滚动条位置 */
    scrollLeft: number
    /** 竖向滚动条位置 */
    scrollTop: number
    /** 滚动条高度 */
    scrollHeight: number
    /** 滚动条宽度 */
    scrollWidth: number
    deltaX: number
    deltaY: number
  }
}

/** 可滚动视图区域。使用竖向滚动时，需要给scroll-view一个固定高度，通过 WXSS 设置 height。组件属性的长度单位默认为 px
 *
 * Tips:
 * H5 中 ScrollView 组件是通过一个高度（或宽度）固定的容器内部滚动来实现的，因此务必正确的设置容器的高度。例如: 如果 ScrollView 的高度将 body 撑开，就会同时存在两个滚动条（body 下的滚动条，以及 ScrollView 的滚动条）。
 * 微信小程序 中 ScrollView 组件如果设置 scrollX 横向滚动时，并且子元素为多个时（单个子元素时设置固定宽度则可以正常横向滚动），需要通过 WXSS 设置 `white-space: nowrap` 来保证元素不换行，并对 ScrollView 内部元素设置 `display: inline-block` 来使其能够横向滚动。
 * @classification viewContainer
 * @example
 * ```tsx
 * export default class PageView extends Component {
 *   constructor() {
 *     super(...arguments)
 *   }
 *
 *   onScrollToUpper() {}
 *
 *   // or 使用箭头函数
 *   // onScrollToUpper = () => {}
 *
 *   onScroll(e){
 *     console.log(e.detail)
 *   }
 *
 *   render() {
 *     const scrollStyle = {
 *       height: '150px'
 *     }
 *     const scrollTop = 0
 *     const Threshold = 20
 *     const vStyleA = {
 *       height: '150px',
 *       'background-color': 'rgb(26, 173, 25)'
 *     }
 *     const vStyleB = {
 *        height: '150px',
 *       'background-color': 'rgb(39,130,215)'
 *     }
 *     const vStyleC = {
 *       height: '150px',
 *       'background-color': 'rgb(241,241,241)',
 *       color: '#333'
 *     }
 *     return (
 *       <ScrollView
 *         className='scrollview'
 *         scrollY
 *         scrollWithAnimation
 *         scrollTop={scrollTop}
 *         style={scrollStyle}
 *         lowerThreshold={Threshold}
 *         upperThreshold={Threshold}
 *         onScrollToUpper={this.onScrollToUpper.bind(this)} // 使用箭头函数的时候 可以这样写 `onScrollToUpper={this.onScrollToUpper}`
 *         onScroll={this.onScroll}
 *       >
 *         <View style={vStyleA}>A</View>
 *         <View style={vStyleB}>B</View>
 *         <View style={vStyleC}>C</View>
 *       </ScrollView>
 *     )
 *   }
 * }
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/scroll-view.html
 */
declare const ScrollView: ComponentType<ScrollViewProps>

export { ScrollView, ScrollViewProps }
