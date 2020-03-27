import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

interface SwiperProps extends StandardProps {
  /** 是否显示面板指示点
   * @default false
   * @supported weapp, swan, alipay, tt, h5, rn
   */
  indicatorDots?: boolean

  /** 指示点颜色
   * @default "rgba(0, 0, 0, .3)"
   * @supported weapp, swan, alipay, tt, h5, rn
   */
  indicatorColor?: string

  /** 当前选中的指示点颜色
   * @default "#000000"
   * @supported weapp, swan, alipay, tt, h5, rn
   */
  indicatorActiveColor?: string

  /** 是否自动切换
   * @default false
   * @supported weapp, swan, alipay, tt, h5, rn
   */
  autoplay?: boolean

  /** 当前所在滑块的 index
   * @default 0
   * @supported weapp, swan, alipay, tt, h5, rn
   */
  current?: number

  /** 当前所在滑块的 item-id ，不能与 current 被同时指定
   * @default ""
   */
  currentItemId?: string

  /** 自动切换时间间隔
   * @default 5000
   * @supported weapp, swan, alipay, tt, h5, rn
   */
  interval?: number

  /** 滑动动画时长
   * @default 500
   * @supported weapp, swan, alipay, tt, h5
   */
  duration?: number

  /** 是否采用衔接滑动
   * @default false
   * @supported weapp, swan, alipay, tt, h5, rn
   */
  circular?: boolean

  /** 滑动方向是否为纵向
   * @default false
   * @supported weapp, swan, alipay, tt, h5, rn
   */
  vertical?: boolean

  /** 前边距，可用于露出前一项的一小部分，接受 px 和 rpx 值
   * @default "0px"
   * @supported weapp
   */
  previousMargin?: string

  /** 后边距，可用于露出后一项的一小部分，接受 px 和 rpx 值
   * @default "0px"
   * @supported weapp
   */
  nextMargin?: string

  /** 同时显示的滑块数量
   * @default 1
   * @supported weapp, swan, tt
   */
  displayMultipleItems?: number

  /** 是否跳过未显示的滑块布局，设为 true 可优化复杂情况下的滑动性能，但会丢失隐藏状态滑块的布局信息
   * @default false
   * @supported weapp, swan
   */
  skipHiddenItemLayout?: boolean

  /** 指定 swiper 切换缓动动画类型
   * @default "default"
   * @supported weapp
   */
  easingFunction?: keyof SwiperProps.TEasingFunction

  /** current 改变时会触发 change 事件
   * @supported weapp, swan, alipay, tt, h5, rn
   */
  onChange?: CommonEventFunction<SwiperProps.onChangeEventDeatil>

  /** swiper-item 的位置发生改变时会触发 transition 事件
   * @supported weapp
   */
  onTransition?: CommonEventFunction<SwiperProps.onTransitionEventDetail>

  /** 动画结束时会触发 animationfinish 事件
   * @supported weapp, swan, h5, rn
   */
  onAnimationFinish?: SwiperProps['onChange']
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

  interface onChangeEventDeatil {
    /** 当前所在滑块的索引 */
    current: number
    /** 导致变更的原因 */
    source: keyof SwiperProps.TChangeSource
  }

  interface onTransitionEventDetail {
    /** X 坐标 */
    dx: number
    /** Y 坐标 */
    dy: number
  }
}

/** 滑块视图容器。其中只可放置 swiper-item 组件，否则会导致未定义的行为。
 * @classification viewContainer
 * @supported weapp, swan, alipay, tt, h5, rn
 * @example
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
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/swiper.html
 */
declare const Swiper: ComponentType<SwiperProps>

export { Swiper, SwiperProps }
