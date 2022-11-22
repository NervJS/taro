import { ComponentType } from 'react'
import { StandardProps } from './common'
interface FollowSwanProps extends StandardProps {
  /** 组件大小
   * @supported swan
   * @default "default"
   */
  size?: string

  /** 组件样式
   * @supported swan
   * @default "primary"
   */
  type?: string

  /** 关注和取消关注成功的回调，返回关注状态 {isFavor: true|false}
   * @supported swan
   */
  onFavorStatusChange?: CommonEventFunction
}

/** 关注小程序
 * @classification open
 * @supported swan
 * @see https://smartprogram.baidu.com/docs/develop/extended/component-content/follow-swan/
 */
declare const FollowSwan: ComponentType<FollowSwanProps>
export { FollowSwan, FollowSwanProps }
