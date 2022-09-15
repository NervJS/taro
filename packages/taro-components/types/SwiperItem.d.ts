import { ComponentType } from 'react'
import { StandardProps } from './common'
interface SwiperItemProps extends StandardProps {
  /** 该 swiper-item 的标识符
   * @supported weapp, swan, tt, jd, h5, rn
   */
  itemId?: string

  /** 是否跳过未显示的滑块布局，设为 true 可优化复杂情况下的滑动性能，但会丢失隐藏状态滑块的布局信息
   * @supported weapp
   */
  skipHiddenItemLayout?: string
}

/** 仅可放置在 swiper 组件中，宽高自动设置为100%
 * > 不要为 `SwiperItem` 设置 **style** 属性，可以通过 class 设置样式。[7147](https://github.com/NervJS/taro/issues/7147)
 * @classification viewContainer
 * @supported weapp, swan, alipay, tt, h5, rn
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
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/swiper-item.html
 */
declare const SwiperItem: ComponentType<SwiperItemProps>
export { SwiperItem, SwiperItemProps }
