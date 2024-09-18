import { ComponentType } from 'react'
import { StandardProps } from './common'
interface RootPortalProps extends StandardProps {
  /**
   * 是否从页面中脱离出来
   * @supported weapp, alipay
   * @default true
   */
  enable?: boolean
}
/** root-portal
 * 使整个子树从页面中脱离出来，类似于在 CSS 中使用 fixed position 的效果。主要用于制作弹窗、弹出层等。
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/root-portal.html
 * @classification viewContainer
 * @supported weapp
 * @example_react
 * ```tsx
 * import { useState } from 'react'
 * import { RootPortal, View, Button } from '@tarojs/components'
 *
 * export default function RootPortalExample {
 *   const [show, setShow] = useState(false)
 *   const toggle = () => {
 *     setShow(!show)
 *   }
 *   render () {
 *     return (
 *       <View>
 *         <Button onClick={toggle}>显示root-portal</Button>
 *         {
 *           show && (<RootPortal><View>content</View></RootPortal>)
 *         }
 *       </View>
 *     )
 *   }
 * }
 * ```
 */
declare const RootPortal: ComponentType<RootPortalProps>
export { RootPortal, RootPortalProps }
