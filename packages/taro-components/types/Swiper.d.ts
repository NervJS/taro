import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'
interface SwiperProps extends StandardProps {
  /** 是否显示面板指示点
   * @default false
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony_hybrid
   */
  indicatorDots?: boolean
  /** 指示点颜色
   * @default "rgba(0, 0, 0, .3)"
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony_hybrid
   */
  indicatorColor?: string
  /** 当前选中的指示点颜色
   * @default "#000000"
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony_hybrid
   */
  indicatorActiveColor?: string
  /** 是否自动切换
   * @default false
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony_hybrid
   */
  autoplay?: boolean
  /** 当前所在滑块的 index
   * @default 0
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony_hybrid
   */
  current?: number
  /** 当前所在滑块的 item-id ，不能与 current 被同时指定
   * @supported swan, tt, qq, jd, h5, harmony_hybrid
   * @weapp deprecated
   * @default ""
   */
  currentItemId?: string
  /** 自动切换时间间隔
   * @default 5000
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony_hybrid
   */
  interval?: number
  /** 滑动动画时长
   * @default 500
   * @supported weapp, alipay, swan, tt, qq, jd, h5, harmony_hybrid
   */
  duration?: number
  /** 是否采用衔接滑动
   * @default false
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony_hybrid
   */
  circular?: boolean
  /** 滑动方向是否为纵向
   * @default false
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony_hybrid
   */
  vertical?: boolean
  /** 前边距，可用于露出前一项的一小部分，接受 px 和 rpx 值
   * @default "0px"
   * @supported weapp, alipay, swan, tt, qq, jd, h5, harmony_hybrid
   */
  previousMargin?: string
  /** 后边距，可用于露出后一项的一小部分，接受 px 和 rpx 值
   * @default "0px"
   * @supported weapp, alipay, swan, tt, qq, jd, h5, harmony_hybrid
   */
  nextMargin?: string
  /**
   * 当 swiper-item 的个数大于等于 2，关闭 circular 并且开启 previous-margin 或 next-margin 的时候，可以指定这个边距是否应用到第一个、最后一个元素
   * @default false
   * @supported weapp, alipay
   */
  snapToEdge?: boolean
  /** 同时显示的滑块数量
   * @default 1
   * @supported weapp, alipay, swan, tt, qq, jd, h5, harmony_hybrid
   */
  displayMultipleItems?: number
  /** 是否跳过未显示的滑块布局，设为 true 可优化复杂情况下的滑动性能，但会丢失隐藏状态滑块的布局信息
   * @default false
   * @supported qq, jd
   */
  skipHiddenItemLayout?: boolean
  /** 指定 swiper 切换缓动动画类型
   * @default "default"
   * @supported weapp, alipay, tt, jd
   */
  easingFunction?: keyof SwiperProps.TEasingFunction
  /** 是否禁止用户 touch 操作
   * @default false
   * @supported alipay
   */
  disableTouch?: boolean
  /** 是否启用缩放
   * @default false
   * @supported h5, harmony_hybrid
   */
  zoom?: boolean
  /** 是否开启全屏
   * @default false
   * @supported h5, harmony_hybrid
   */
  full?: boolean
  /** swiper-item 可见时的 class。
   * @supported alipay
   */
  activeClass?: string
  /** acceleration 设置为 {{true}} 时且处于滑动过程中，中间若干屏处于可见时的 class。
   * @supported alipay
   */
  changingClass?: string
  /** 当开启时，会根据滑动速度，连续滑动多屏。
   * @default false
   * @supported alipay
   */
  acceleration?: string
  /** 是否禁用代码变动触发 swiper 切换时使用动画。
   * @default false
   * @supported alipay
   */
  disableProgrammaticAnimation?: string
  /** 滑动距离阈值，当滑动距离超过阈值时进行 swiper-item 切换。
   * @supported alipay
   */
  swipeRatio?: string
  /** 滑动综合速度阈值，当超过阈值时进行 swiper-item 切换，数值越小越敏感。
   * @supported alipay
   */
  swipeSpeed?: string
  /** 计算用户手势时所依赖的滑动角度。角度根据 touchstart 事件和首次 touchmove 事件的坐标计算得出。数值越小越对用户的滑动方向准确度要求越高。
   * @supported alipay
   */
  touchAngle?: string
  /** 自动以指定滑块的高度为整个容器的高度。当 vertical 为 true 时，默认不调整。可选值为：
   * @supported alipay
   */
  adjustHeight?: 'first' | 'current' | 'highest' | 'none'
  /** vertical 为 true 时强制使 adjust-height 生效。
   * @supported alipay
   */
  adjustVerticalHeight?: string
  /** 是否停止响应用户 touchmove 操作
   * @default false
   * @supported swan
   */
  disableTouchmove?: string
  /** 改变 current 时使用动画过渡
   * @supported weapp
   * @default true
   */
  scrollWithAnimation?: boolean
  /** 缓存区域大小，值为 1 表示提前渲染上下各一屏区域（swiper 容器大小）
   * @supported weapp
   * @default 0
   */
  cacheExtent?: number
  /** current 改变时会触发 change 事件
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony_hybrid
   */
  onChange?: CommonEventFunction<SwiperProps.onChangeEventDetail>
  /** swiper-item 的位置发生改变时会触发 transition 事件
   * @supported weapp, alipay, tt, qq
   */
  onTransition?: CommonEventFunction<SwiperProps.onTransitionEventDetail>
  /** 动画结束时会触发 animationfinish 事件
   * @supported weapp, swan, tt, qq, jd, h5, rn, harmony_hybrid
   */
  onAnimationFinish?: SwiperProps['onChange']
  /** 动画结束时会触发 animationEnd 事件
   * @supported alipay
   */
  onAnimationEnd?: CommonEventFunction<SwiperProps.onCommonEventDetail>
}
declare namespace SwiperProps {
  /** 导致变更的原因 */
  interface TChangeSource {
    /** 自动播放 */
    autoplay
    /** 用户划动 */
    touch
    /** 其它原因 */
    ''
  }
  /** 指定 swiper 切换缓动动画类型 */
  interface TEasingFunction {
    /** 默认缓动函数 */
    default
    /** 线性动画 */
    linear
    /** 缓入动画 */
    easeInCubic
    /** 缓出动画 */
    easeOutCubic
    /** 缓入缓出动画 */
    easeInOutCubic
  }
  interface onCommonEventDetail {
    /** 当前所在滑块的索引 */
    current: number
    /** 导致变更的原因 */
    source: keyof SwiperProps.TChangeSource
  }
  interface onChangeEventDetail {
    /** 当前所在滑块的索引 */
    current: number
    /** 导致变更的原因 */
    source: keyof SwiperProps.TChangeSource
    /** SwiperItem的itemId参数值 */
    currentItemId?: string
  }
  interface onTransitionEventDetail {
    /** X 坐标 */
    dx: number
    /** Y 坐标 */
    dy: number
  }
}
/** 滑块视图容器。其中只可放置 swiper-item 组件，否则会导致未定义的行为。
 * > 不要为 `SwiperItem` 设置 **style** 属性，可以通过 class 设置样式。[7147](https://github.com/NervJS/taro/issues/7147)
 * @classification viewContainer
 * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony, harmony_hybrid
 * @example_react
 * ```tsx
 * class App extends Component {
 *   render () {
 *     return (
 *       <Swiper
 *         className='test-h'
 *         indicatorColor='#999'
 *         indicatorActiveColor='#333'
 *         vertical
 *         circular
 *         indicatorDots
 *         autoplay>
 *         <SwiperItem>
 *           <View className='demo-text-1'>1</View>
 *         </SwiperItem>
 *         <SwiperItem>
 *           <View className='demo-text-2'>2</View>
 *         </SwiperItem>
 *         <SwiperItem>
 *           <View className='demo-text-3'>3</View>
 *         </SwiperItem>
 *       </Swiper>
 *     )
 *   }
 * }
 * ```
 * @example_vue
 * ```html
 * <template>
 *   <swiper
 *     class='test-h'
 *     indicator-color='#999'
 *     indicator-active-color='#333'
 *     :vertical="true"
 *     :circular="true"
 *     :indicator-dots="true"
 *     :autoplay="true"
 *   >
 *     <swiper-item>
 *       <view class='demo-text-1'>1</view>
 *     </swiper-item>
 *     <swiper-item>
 *       <view class='demo-text-2'>2</view>
 *     </swiper-item>
 *     <swiper-item>
 *       <view class='demo-text-3'>3</view>
 *     </swiper-item>
 *   </swiper>
 * </template>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/swiper.html
 */
declare const Swiper: ComponentType<SwiperProps>
export { Swiper, SwiperProps }
