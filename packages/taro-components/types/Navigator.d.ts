import { ComponentType } from 'react'
import { StandardProps } from './common'

export interface NavigatorProps extends StandardProps {

  /**
   * 在哪个目标上发生跳转，默认当前小程序
   */
  target?: string,

  /**
   * 当前小程序内的跳转链接
   */
  url?: string,

  /**
   * 跳转方式
   *
   * 默认值：`navigate`
   */
  openType?: 'navigate' | 'redirect' | 'switchTab' | 'reLaunch' | 'navigateBack' | 'exit',

  /**
   * 当 open-type 为 'navigateBack' 时有效，表示回退的层数
   */
  delta?: number,

  /**
   * 当target="miniProgram"时有效，要打开的小程序 appId
   */
  appId?: string,

  /**
   * 当target="miniProgram"时有效，打开的页面路径，如果为空则打开首页
   */
  path?: string,

  /**
   * 当target="miniProgram"时有效，需要传递给目标小程序的数据，目标小程序可在 App.onLaunch()，App.onShow() 中获取到这份数据.
   */
  extraData?: object,
  version?: string,
  /**
   * 指定按下去的样式类。当 `hover-class="none"` 时，没有点击态效果
   *
   * 默认值：`navigator-hover`
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
   * 默认值：`600`
   */
  hoverStayTime?: number
}

declare const Navigator: ComponentType<NavigatorProps>

export { Navigator }
