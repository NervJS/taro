import { ComponentType } from 'react'

interface StandardProps extends EventProps {
  /**
   * 组件的唯一标示, 保持整个页面唯一
   */
  id?: string,
  /**
   * 同 `class`，在 React/Nerv 里一般使用 `className` 作为 `class` 的代称
   */
  className?: string,
  /**
   * 组件的内联样式, 可以动态设置的内联样式
   */
  style?: string,
  /**
   * 如果列表中项目的位置会动态改变或者有新的项目添加到列表中，
   * 需要使用 `wx:key` 来指定列表中项目的唯一的标识符。
   */
  key?: string,
  /**
   * 组件是否显示, 所有组件默认显示
   */
  hidden?: boolean
}

interface EventProps {
  /**
   * 手指触摸动作开始	
   */
  onTouchStart?: (event: ITouchEvent) => any,

  /**
   * 手指触摸后移动	
   */
  onTouchMove?: (event: ITouchEvent) => any,

  /**
   * 手指触摸动作被打断，如来电提醒，弹窗	
   */
  onTouchCancel?: (event: ITouchEvent) => any,

  /**
   * 手指触摸动作结束	
   */
  onTouchEnd?: (event: ITouchEvent) => any,

  /**
   * 手指触摸后马上离开	
   */
  onClick?: (event: ITouchEvent) => any,

  /**
   * 手指触摸后，超过350ms再离开，如果指定了事件回调函数并触发了这个事件，tap事件将不被触发	
   */
  onLongPress?: (event: BaseEvent) => any,

  /**
   * 手指触摸后，超过350ms再离开（推荐使用longpress事件代替）	
   */
  onLongClick?: (event: BaseEvent) => any,
  
  /**
   * 会在 WXSS transition 或 wx.createAnimation 动画结束后触发	
   */
  onTransitionEnd?: (event: BaseEvent) => any,

  /**
   * 会在一个 WXSS animation 动画开始时触发	
   */
  onAnimationStart?: (event: BaseEvent) => any,

  /**
   * 会在一个 WXSS animation 一次迭代结束时触发	
   */
  onAnimationIteration?: (event: BaseEvent) => any,

  /**
   * 会在一个 WXSS animation 动画完成时触发	
   */
  onAnimationEnd?: (event: BaseEvent) => any,

  /**
   * 在支持 3D Touch 的 iPhone 设备，重按时会触发	
   */
  onTouchForceChange?: (event: BaseEvent) => any
}

interface BaseEvent {
  /**
   * 事件类型
   */
  type: string,

  /**
   * 事件生成时的时间戳
   */
  timeStamp: number,

  /**
   * 触发事件的组件的一些属性值集合
   */
  target: Target,

  /**
   * 当前组件的一些属性值集合
   */
  currentTarget: currentTarget,

  /**
   * 额外的信息
   */
  detail: Object
}

interface ITouchEvent extends BaseEvent {
  /**
   * 触摸事件，当前停留在屏幕中的触摸点信息的数组
   */
  touches: Array<ITouch>,

  /**
   * 触摸事件，当前变化的触摸点信息的数组
   */
  changedTouches: Array<CanvasTouch>
}

interface CanvasTouch {
  identifier: number,
  x: number,
  y: number
}

interface ITouch extends Touch {
  /**
   * 触摸点的标识符
   */
  identifier: number,
  /**
   * 距离文档左上角的距离，文档的左上角为原点 ，横向为X轴，纵向为Y轴
   */
  pageX: number,
  /**
   * 距离文档左上角的距离，文档的左上角为原点 ，横向为X轴，纵向为Y轴
   */
  pageY: number,
  /**
   * 距离页面可显示区域（屏幕除去导航条）左上角距离，横向为X轴，纵向为Y轴
   */
  clientX: number,
  /**
   * 距离页面可显示区域（屏幕除去导航条）左上角距离，横向为X轴，纵向为Y轴
   */
  clientY: number
}

interface Target {
  /**
   * 事件源组件的id
   */
  id: string,
  /**
   * 当前组件的类型
   */
  tagName: string,
  /**
   * 事件源组件上由data-开头的自定义属性组成的集合
   */
  dataset: object
}

interface currentTarget extends Target {}

interface ViewProps extends StandardProps {
  /**
   * 指定按下去的样式类。当 `hover-class="none"` 时，没有点击态效果
   * 
   * 默认值：`none`
   */
  hoverClass?: string,

  /**
   * 指定是否阻止本节点的祖先节点出现点击态	
   * 
   * 默认值：`fasle`
   */
  hoverStopPropagation?: boolean,

  /**
   * 按住后多久出现点击态，单位毫秒	
   * 
   * 默认值：`50`
   */
  hoverStartTime?: number,

  /**
   * 手指松开后点击态保留时间，单位毫秒
   * 
   * 默认值：`400`
   */
  hoverStayTime?: number
}

const View: ComponentType<ViewProps>

interface ScrollViewProps extends StandardProps {
  
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
  onScrollToUpper?: (event: BaseEvent) => any,
  
  /**
   * 滚动到底部/右边，会触发 scrolltolower 事件
   */
  onScrollToLower?: (event: BaseEvent) => any,
  
  /**
   * 滚动时触发
   * 
   * `event.detail = {scrollLeft, scrollTop, scrollHeight, scrollWidth, deltaX, deltaY}`
   */
  onScroll?: (event: BaseEvent) => any
}

const ScrollView: ComponentType<ScrollViewProps>

interface SwiperProps extends StandardProps {
  
  /**
   * 是否显示面板指示点	
   *
   * 默认值：`false`
   */
  indicatorDots?: boolean,
  
  /**
   * 指示点颜色	
   *
   * 默认值：`rgba(0, 0, 0, .3)`
   */
  indicatorColor?: string,
  
  /**
   * 当前选中的指示点颜色	
   *
   * 默认值：`#000000`
   */
  indicatorActiveColor?: string,
  
  /**
   * 是否自动切换	
   *
   * 默认值：`false`
   */
  autoplay?: boolean,
  
  /**
   * 当前所在滑块的 index	
   *
   * 默认值：`0`
   */
  current?: number,
  
  /**
   * 当前所在滑块的 item-id ，不能与 current 被同时指定	
   *
   * 默认值：`""`
   */
  currentItemId?: string,
  
  /**
   * 自动切换时间间隔	
   *
   * 默认值：`5000`
   */
  interval?: number,
  
  /**
   * 滑动动画时长	
   *
   * 默认值：`500`
   */
  duration?: number,
  
  /**
   * 是否采用衔接滑动	
   *
   * 默认值：`false`
   */
  circular?: boolean,
  
  /**
   * 滑动方向是否为纵向	
   *
   * 默认值：`false`
   */
  vertical?: boolean,
  
  /**
   * 前边距，可用于露出前一项的一小部分，接受 px 和 rpx 值	
   *
   * 默认值：`0px`
   */
  previousMargin?: string,
  
  /**
   * 后边距，可用于露出后一项的一小部分，接受 px 和 rpx 值	
   *
   * 默认值：`0px`
   */
  nextMargin?: string,
  
  /**
   * 同时显示的滑块数量	
   *
   * 默认值：`1`
   */
  displayMultipleItems?: number,
  
  /**
   * 是否跳过未显示的滑块布局，设为 true 可优化复杂情况下的滑动性能，但会丢失隐藏状态滑块的布局信息	
   *
   * 默认值：`false`
   */
  skipHiddenItemLayout?: boolean

  
  /**
   * current 改变时会触发 change 事件
   * 
   * `event.detail = {current: current, source: source}`
   */
  onChange?: (event: BaseEvent) => any
  
  /**
   * 动画结束时会触发 animationfinish 事件
   *
   * `event.detail = {current: current, source: source}`
   */
  onAnimationFinish?: (event: BaseEvent) => any
}


export {
  View,
  ScrollView,
  SwiperProps
}
