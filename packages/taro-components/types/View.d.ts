import { ComponentType } from 'react'
import { StandardProps } from './common'

export interface ViewProps extends StandardProps {
  /**
   * 指定按下去的样式类。当 `hover-class="none"` 时，没有点击态效果
   *
   * 默认值：`none`
   */
  hoverClass?: string,

  /**
   * 指定是否阻止本节点的祖先节点出现点击态
   *
   * 默认值：`fasle`
   */
  hoverStopPropagation?: boolean,

  /**
   * 按住后多久出现点击态，单位毫秒
   *
   * 默认值：`50`
   */
  hoverStartTime?: number,

  /**
   * 手指松开后点击态保留时间，单位毫秒
   *
   * 默认值：`400`
   */
  hoverStayTime?: number
}

declare const View: ComponentType<ViewProps>

export {
  View
}
