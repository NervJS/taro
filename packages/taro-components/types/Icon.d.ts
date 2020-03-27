import { ComponentType } from 'react'
import { StandardProps } from './common'

interface IconProps extends StandardProps {
  /** icon 的类型
   * @supported weapp, swan, alipay, tt, h5, rn
   */
  type: keyof IconProps.TIconType

  /** icon 的大小，单位px
   * @default 23
   * @supported weapp, swan, alipay, tt, h5, rn
   */
  size?: string,

  /** icon 的颜色，同 css 的 color
   * @supported weapp, swan, alipay, tt, h5, rn
   */
  color?: string
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
    /** 清楚图标 */
    clear
  }
}

/** 图标。组件属性的长度单位默认为 px
 * @classification base
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
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/icon.html
 */
declare const Icon: ComponentType<IconProps>

export { Icon, IconProps }
