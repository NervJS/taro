import { ComponentType } from 'react'
import { StandardProps } from './common'

export interface OfficialAccountProps extends StandardProps {

  /**
   * 组件加载成功时触发
   */
  onLoad?(): any,
  /**
   * 组件加载失败时触发
   */
  onError?(): any
}

declare const OfficialAccount: ComponentType<OfficialAccountProps>

export { OfficialAccount }
