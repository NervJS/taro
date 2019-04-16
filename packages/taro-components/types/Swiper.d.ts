import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

export interface SwiperProps extends StandardProps {

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
  skipHiddenItemLayout?: boolean,

  /**
   * 指定 swiper 切换缓动动画类型
   *
   * - `default`: 默认缓动函数
   * - `linear`: 线性动画
   * - `easeInCubic`: 缓入动画
   * - `easeOutCubic`: 缓出动画
   * - `easeInOutCubic`: 缓入缓出动画
   *
   * @default 'default'
   * @since 2.6.5
   */
  easingFunction?: 'default' | 'linear' | 'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic',

  /**
   * current 改变时会触发 change 事件
   *
   * `event.detail = {current: current, source: source}`
   */
  onChange?: CommonEventFunction<{
    /** 当前所在滑块的索引 */
    current: number,
    /**
     * 导致变更的原因
     *
     * - `autoplay`: 自动播放
     * - `touch`: 用户划动
     * - `(空字符串)`: 其它原因
     */
    source: 'autoplay' | 'touch' | '',
  }>,

  /**
   * swiper-item 的位置发生改变时会触发 transition 事件
   *
   * @since 2.4.3
   */
  onTransition?: CommonEventFunction<{
    dx: number,
    dy: number,
  }>,

  /**
   * 动画结束时会触发 animationfinish 事件
   *
   * `event.detail = {current: current, source: source}`
   */
  onAnimationFinish?: SwiperProps['onChange'],
}

declare const Swiper: ComponentType<SwiperProps>

export interface SwiperItemProps extends StandardProps {

  /**
   * 该 swiper-item 的标识符
   */
  itemId?: string
}

declare const SwiperItem: ComponentType<SwiperItemProps>

export {
  Swiper,
  SwiperItem
}
