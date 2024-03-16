import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'
interface NavigatorProps extends StandardProps {
  /** 在哪个目标上发生跳转，默认当前小程序
   * @default "self"
   * @supported weapp, swan, qq
   */
  target?: keyof NavigatorProps.Target
  /** 当前小程序内的跳转链接
   * @supported weapp, alipay, swan, tt, qq, jd, h5, harmony_hybrid
   */
  url?: string
  /** 跳转方式
   * @default "navigate"
   * @supported weapp, alipay, swan, tt, qq, jd, h5, harmony_hybrid
   */
  openType?: keyof NavigatorProps.OpenType
  /** 当 open-type 为 'navigateBack' 时有效，表示回退的层数
   * @supported weapp, swan, tt, qq, jd, h5, harmony_hybrid
   */
  delta?: number
  /** 当 `target="miniProgram"` 时有效，要打开的小程序 appId
   * @supported weapp, swan, qq
   */
  appId?: string
  /** 当 `target="miniProgram"` 时有效，打开的页面路径，如果为空则打开首页
   * @supported weapp, swan, qq
   */
  path?: string
  /** 当 `target="miniProgram"` 时有效，需要传递给目标小程序的数据，目标小程序可在 `App.onLaunch()`，`App.onShow()` 中获取到这份数据.
   * @supported weapp, swan, qq
   */
  extraData?: object
  /** 当 `target="miniProgram"` 时有效，要打开的小程序版本
   * @supported weapp, swan, qq
   */
  version?: keyof NavigatorProps.Version
  /** 指定按下去的样式类。当 `hover-class="none"` 时，没有点击态效果
   * @default "navigator-hover"
   * @supported weapp, alipay, swan, tt, qq, jd, h5, harmony_hybrid
   */
  hoverClass?: string
  /** 指定是否阻止本节点的祖先节点出现点击态
   * @default false
   * @supported weapp, swan, tt, qq, jd
   */
  hoverStopPropagation?: boolean
  /** 按住后多久出现点击态，单位毫秒
   * @default 50
   * @supported weapp, alipay, swan, tt, qq, jd
   */
  hoverStartTime?: number
  /** 手指松开后点击态保留时间，单位毫秒
   * @default 600
   * @supported weapp, alipay, swan, tt, qq, jd
   */
  hoverStayTime?: number
  /** 当target="miniProgram"时有效，当传递该参数后，可以不传 app-id 和 path。链接可以通过【小程序菜单】->【复制链接】获取。
   * @supported weapp
   */
  shortLink?: string
  /** 无障碍访问，（属性）元素的额外描述
   * @supported qq
   */
  ariaLabel?: string
  /** 当 `target="miniProgram"` 时有效，跳转小程序成功
   * @supported weapp, swan, qq, h5, harmony_hybrid
   */
  onSuccess?: CommonEventFunction
  /** 当 `target="miniProgram"` 时有效，跳转小程序失败
   * @supported weapp, swan, qq, h5, harmony_hybrid
   */
  onFail?: CommonEventFunction
  /** 当 `target="miniProgram"` 时有效，跳转小程序完成
   * @supported weapp, swan, qq, h5, harmony_hybrid
   */
  onComplete?: CommonEventFunction
}
declare namespace NavigatorProps {
  /** target 的合法值 */
  interface Target {
    /** 当前小程序 */
    self
    /** 其它小程序 */
    miniProgram
  }
  /** open-type 的合法值 */
  interface OpenType {
    /** 对应 Taro.navigateTo 或 Taro.navigateToMiniProgram 的功能 */
    navigate
    /** 对应 Taro.redirectTo 的功能 */
    redirect
    /** 对应 Taro.switchTab 的功能 */
    switchTab
    /** 对应 Taro.reLaunch 的功能 */
    reLaunch
    /** 对应 Taro.navigateBack 的功能 */
    navigateBack
    /** 退出小程序，`target="miniProgram"` 时生效 */
    exit
  }
  /** version 的合法值 */
  interface Version {
    /** 开发版 */
    develop
    /** 体验版 */
    trial
    /** 正式版，仅在当前小程序为开发版或体验版时此参数有效；如果当前小程序是正式版，则打开的小程序必定是正式版。 */
    release
  }
}
/** 页面链接
 * @classification navig
 * @supported weapp, alipay, swan, tt, qq, jd, harmony, h5, harmony_hybrid
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/navigator.html
 */
declare const Navigator: ComponentType<NavigatorProps>
export { Navigator, NavigatorProps }
