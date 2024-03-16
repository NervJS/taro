import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'
interface NavigationBarProps extends StandardProps {
  /** 导航条标题
   * @supported weapp
   */
  title?: string
  /** 是否在导航条显示 loading 加载提示
   * @supported weapp
   */
  loading?: boolean
  /** 导航条前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
   * @supported weapp
   */
  frontColor?: string
  /** 导航条背景颜色值，有效值为十六进制颜色
   * @supported weapp
   */
  backgroundColor?: string
  /** 改变导航栏颜色时的动画时长，默认为 0 （即没有动画效果）
   * @default 0
   * @supported weapp
   */
  colorAnimationDuration?: string
  /** 改变导航栏颜色时的动画方式，支持 linear 、 easeIn 、 easeOut 和 easeInOut
   * @default "linear"
   * @supported weapp
   */
  colorAnimationTimingFunc?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut'
}
/** 页面导航条配置节点，用于指定导航栏的一些属性。只能是 PageMeta 组件内的第一个节点，需要配合它一同使用。
 * 通过这个节点可以获得类似于调用 Taro.setNavigationBarTitle Taro.setNavigationBarColor 等接口调用的效果。
 *
 * :::info
 * Taro v3.6.19 开始支持
 * 需要配合 PageMeta 组件使用
 * :::
 *
 * @classification navig
 * @supported weapp, harmony
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/navigation-bar.html
 */
declare const NavigationBar: ComponentType<NavigationBarProps>
export { NavigationBar, NavigationBarProps }
