import { ComponentType } from 'react'
import { StandardProps } from './common'

interface ViewProps extends StandardProps {
  /** 指定按下去的样式类。当 `hover-class="none"` 时，没有点击态效果
   * @default none
   * @supported weapp, swan, alipay, tt, h5
   * @rn 由于 RN 不支持 Class，故 RN 端的 View 组件实现了 `hoverStyle`属性，写法和 style 类似，只不过 `hoverStyle` 的样式是指定按下去的样式。
   */
  hoverClass?: string

  /** 由于 RN 不支持 Class，故 RN 端的 View 组件实现了 `hoverStyle`属性，写法和 style 类似，只不过 `hoverStyle` 的样式是指定按下去的样式。
   * @default none
   * @supported rn
   */
  hoverStyle?: string

  /** 指定是否阻止本节点的祖先节点出现点击态
   * @default fasle
   * @supported weapp, swan, alipay, tt
   */
  hoverStopPropagation?: boolean

  /** 按住后多久出现点击态，单位毫秒
   * @default 50
   * @supported weapp, swan, alipay, tt, h5, rn
   */
  hoverStartTime?: number

  /** 手指松开后点击态保留时间，单位毫秒
   * @default 400
   * @supported weapp, swan, alipay, tt, h5, rn
   */
  hoverStayTime?: number
}

/** 视图容器
 * @classification viewContainer
 * @supported weapp, swan, alipay, tt, h5, rn
 * @example
 * ```tsx
 * export default class PageView extends Component {
 *   constructor() {
 *     super(...arguments)
 *   }
 * 
 *   render() {
 *     return (
 *       <View className='components-page'>
 *         <Text>flex-direction: row 横向布局</Text>
 *         <View className='flex-wrp' style='flex-direction:row;'>
 *           <View className='flex-item demo-text-1'/>
 *           <View className='flex-item demo-text-2'/>
 *           <View className='flex-item demo-text-3'/>
 *         </View>
 *         <Text>flex-direction: column 纵向布局</Text>
 *         <View className='flex-wrp' style='flex-direction:column;'>
 *           <View className='flex-item flex-item-V demo-text-1'/>
 *           <View className='flex-item flex-item-V demo-text-2'/>
 *           <View className='flex-item flex-item-V demo-text-3'/>
 *         </View>
 *       </View>
 *     )
 *   }
 * }
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/view.html
 */
declare const View: ComponentType<ViewProps>

export { View, ViewProps }
