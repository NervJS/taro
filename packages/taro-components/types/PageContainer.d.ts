import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'
interface PageContainerProps extends StandardProps {
  /** 是否显示容器组件
   * @default false
   * @supported weapp, alipay, jd, rn
   */
  show?: boolean
  /** 动画时长，单位毫秒
   * @default 300
   * @supported weapp, alipay, jd, rn
   */
  duration?: number
  /** z-index 层级
   * @default 100
   * @supported weapp, alipay
   */
  zIndex?: number
  /** 是否显示遮罩层
   * @default true
   * @supported weapp, alipay, jd, rn
   */
  overlay?: boolean
  /** 弹出位置，可选值为 top bottom right center
   * @default bottom
   * @supported weapp, alipay, jd, rn
   */
  position?: keyof PageContainerProps.Position
  /** 是否显示圆角
   * @default false
   * @supported weapp, alipay, jd, rn
   */
  round?: boolean
  /** 自定义遮罩层样式
   * @supported weapp, alipay, jd, rn
   */
  overlayStyle?: string
  /** 自定义弹出层样式
   * @supported weapp, alipay, jd, rn
   */
  customStyle?: string
  /** 是否在下滑一段距离后关闭
   * @supported weapp, alipay, jd
   * @default false
   */
  closeOnSlideDown?: boolean
  /** 进入前触发
   * @supported weapp, alipay, jd, rn
   */
  onBeforeEnter?: CommonEventFunction
  /** 进入中触发
   * @supported weapp, alipay, jd, rn
   */
  onEnter?: CommonEventFunction
  /** 进入后触发
   * @supported weapp, alipay, jd, rn
   */
  onAfterEnter?: CommonEventFunction
  /** 离开前触发
   * @supported weapp, alipay, jd, rn
   */
  onBeforeLeave?: CommonEventFunction
  /** 离开中触发
   * @supported weapp, alipay, jd, rn
   */
  onLeave?: CommonEventFunction
  /** 离开后触发
   * @supported weapp, alipay, jd, rn
   */
  onAfterLeave?: CommonEventFunction
  /** 点击遮罩层时触发
   * @supported weapp, alipay, jd
   */
  onClickOverlay?: CommonEventFunction
  /** 进入被打断时触发（通过 a: if 打断时不会触发）。
   * @supported alipay
   */
  onEnterCancelled?: CommonEventFunction
  /** 离开被打断时触发（通过 a: if 打断时不会触发）。
   * @supported alipay
   */
  onLeaveCancelled?: CommonEventFunction
}
declare namespace PageContainerProps {
  /** 弹出位置 */
  interface Position {
    /** 上方弹出 */
    top
    /** 下方弹出 */
    bottom
    /** 右边弹出 */
    right
    /** 中央弹出 */
    center
  }
}
/** 页面容器
 *
 * 小程序如果在页面内进行复杂的界面设计（如在页面内弹出半屏的弹窗、在页面内加载一个全屏的子页面等），用户进行返回操作会直接离开当前页面，不符合用户预期，预期应为关闭当前弹出的组件。
 * 为此提供“假页”容器组件，效果类似于 `popup` 弹出层，页面内存在该容器时，当用户进行返回操作，关闭该容器不关闭页面。返回操作包括三种情形，右滑手势、安卓物理返回键和调用 `navigateBack` 接口。
 *
 * Bug & Tip
 *   1. tip: 当前页面最多只有 1 个容器，若已存在容器的情况下，无法增加新的容器
 *   2. tip: wx.navigateBack 无法在页面栈顶调用，此时没有上一级页面
 * @classification viewContainer
 * @supported weapp, alipay, jd, rn
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/page-container.html
 */
declare const PageContainer: ComponentType<PageContainerProps>
export { PageContainer, PageContainerProps }
