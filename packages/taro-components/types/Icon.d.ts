import { ComponentType } from 'react'
import { StandardProps } from './common'
interface IconProps extends StandardProps {
  /** icon 的类型
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony_hybrid
   */
  type: keyof IconProps.TIconType
  /** icon 的大小，单位px
   * @default 23
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony_hybrid
   */
  size?: string
  /** icon 的颜色，同 css 的 color
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony_hybrid
   */
  color?: string
  /** 无障碍访问，（属性）元素的额外描述
   * @supported qq
   */
  ariaLabel?: string
}
declare namespace IconProps {
  /** icon 的类型 */
  interface TIconType {
    /** 成功图标 */
    success
    /** 成功图标（不带外圈） */
    success_no_circle
    /** 信息图标 */
    info
    /** 警告图标 */
    warn
    /** 等待图标 */
    waiting
    /** 取消图标 */
    cancel
    /** 下载图标 */
    download
    /** 搜索图标 */
    search
    /** 清除图标 */
    clear
    /** 圆环图标(多选控件图标未选择)「微信文档未标注属性」 */
    circle
    /** 带圆环的信息图标「微信文档未标注属性」 */
    info_circle
  }
}
/** 图标。组件属性的长度单位默认为 px
 * @classification base
 * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony, harmony_hybrid
 * @example_react
 * ```tsx
 * export default class PageView extends Component {
 *   constructor() {
 *     super(...arguments)
 *   }
 *
 *   render() {
 *     return (
 *       <View className='components-page'>
 *         <Icon size='60' type='success' />
 *         <Icon size='60' type='info' />
 *         <Icon size='60' type='warn' color='#ccc' />
 *         <Icon size='60' type='warn' />
 *         <Icon size='60' type='waiting' />
 *         <Icon size='20' type='success_no_circle' />
 *         <Icon size='20' type='warn' />
 *         <Icon size='20' type='success' />
 *         <Icon size='20' type='download' />
 *         <Icon size='20' type='clear' color='red' />
 *         <Icon size='20' type='search' />
 *       </View>
 *     )
 *   }
 * }
 * ```
 * @example_vue
 * <template>
 *   <view class="components-page">
 *     <icon size="60" type="success" />
 *     <icon size="60" type="info" />
 *     <icon size="60" type="warn" color="#ccc" />
 *     <icon size="60" type="warn" />
 *     <icon size="60" type="waiting" />
 *     <icon size="20" type="success_no_circle" />
 *     <icon size="20" type="warn" />
 *     <icon size="20" type="success" />
 *     <icon size="20" type="download" />
 *     <icon size="20" type="clear" color="red" />
 *     <icon size="20" type="search" />
 *   </view>
 * </template>
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/icon.html
 */
declare const Icon: ComponentType<IconProps>
export { Icon, IconProps }
