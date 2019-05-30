import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

interface OfficialAccountEventDetail {
  /**
   * 状态码
   */
  status: number
  /**
   * 错误信息
   */
  errMsg: string
}

export interface OfficialAccountProps extends StandardProps {

  /**
   * 组件加载成功时触发
   */
  onLoad?: CommonEventFunction<OfficialAccountEventDetail>,
  /**
   * 组件加载失败时触发
   */
  onError?: CommonEventFunction<OfficialAccountEventDetail>
}

declare const OfficialAccount: ComponentType<OfficialAccountProps>

export { OfficialAccount }
