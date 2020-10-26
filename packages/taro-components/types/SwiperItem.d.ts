import { ComponentType } from 'react'
import { StandardProps } from './common'

interface SwiperItemProps extends StandardProps {
  /** 该 swiper-item 的标识符
   * @supported weapp
   */
  itemId?: string
}

/** 仅可放置在 swiper 组件中，宽高自动设置为100%
 * @classification viewContainer
 * @supported weapp
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
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/swiper-item.html
 */
declare const SwiperItem: ComponentType<SwiperItemProps>

export { SwiperItem, SwiperItemProps }
