import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'
interface OpenContainerProps extends StandardProps {
  /**
   * 动画类型
   * @supported weapp
   * @default "fade"
   *
   * 可选值:
   * - fade: 将传入元素淡入传出元素之上
   * - fadeThrough: 首先淡出传出元素，并在传出元素完全淡出后开始淡入传入元素
   */
  transitionType: 'fade' | 'fadeThrough'
  /**
   * 动画时长
   * @supported weapp
   * @default 300
   */
  transitionDuration: number
  /**
   * 初始容器背景色
   * @supported weapp
   * @default "white"
   */
  closedColor: string
  /**
   * 初始容器影深大小
   * @supported weapp
   * @default 0
   */
  closedElevation: number
  /**
   * 初始容器圆角大小
   * @supported weapp
   * @default 0
   */
  closeBorderRadius: number
  /**
   * fadeThrough 模式下的过渡背景色
   * @supported weapp
   * @default ""
   */
  middleColor: string
  /**
   * 打开状态下容器背景色
   * @supported weapp
   * @default "white"
   */
  openColor: string
  /**
   * 打开状态下容器影深大小
   * @supported weapp
   * @default 0
   */
  openElevation: number
  /**
   * 打开状态下容器圆角大小
   * @supported weapp
   * @default 0
   */
  openBorderRadius: number
}

/**
 * 容器转场动画组件
 * 点击 OpenContainer 组件，当使用 wx.navigateTo 跳转下一页面时，对其子节点和下一个页面进行过渡。
 * 下个页面从 OpenContainer 所在位置大小渐显放大，同时 OpenContainer 内容渐隐，过渡效果包含背景色、圆角和阴影。
 * 源页面 OpenContainer 为 closed 状态，转场动画后为 open 状态。
 * @classification skyline
 * @supported weapp
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/open-container.html
 */
declare const OpenContainer: ComponentType<OpenContainerProps>
export { OpenContainer, OpenContainerProps }
