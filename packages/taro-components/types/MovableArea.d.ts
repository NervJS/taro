import { ComponentType } from 'react'
import { StandardProps } from './common'
interface MovableAreaProps extends StandardProps {
  /** 当里面的 movable-view 设置为支持双指缩放时，设置此值可将缩放手势生效区域修改为整个 movable-area
   * @default false
   * @supported weapp, alipay, swan, tt, qq, jd, h5, harmony_hybrid
   */
  scaleArea?: boolean
}
/** movable-view 的可移动区域
 * @classification viewContainer
 * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony_hybrid
 * @example_react
 * ```tsx
 * class App extends Components {
 *   render () {
 *     return (
 *       <MovableArea style='height: 200px; width: 200px; background: red;'>
 *         <MovableView style='height: 50px; width: 50px; background: blue;' direction='all'>旅行的意义</MovableView>
 *       </MovableArea>
 *     )
 *   }
 * }
 * ```
 * @example_vue
 * ```html
 *   <movable-area style='height: 200px; width: 200px; background: red;'>
 *     <movable-view style='height: 50px; width: 50px; background: blue;' direction='all'>在路上</movable-view>
 *   </movable-area>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/movable-area.html
 */
declare const MovableArea: ComponentType<MovableAreaProps>
export { MovableArea, MovableAreaProps }
