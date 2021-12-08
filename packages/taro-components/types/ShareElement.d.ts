import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

interface ShareElementProps extends StandardProps {
  /** 映射标记
   * @supported weapp
   */
  key: string

  /** 是否进行动画
   * @default false
   * @supported weapp
   */
  transform?: boolean

  /** 动画时长，单位毫秒
   * @default 300
   * @supported weapp
   */
  duration?: number

  /** css缓动函数
   * @default ease-out
   * @supported weapp
   */
  easingFunction?: number
}

/** 共享元素
 *
 * 共享元素是一种动画形式，类似于 [`flutter Hero`](https://flutterchina.club/animations/hero-animations/) 动画，表现为元素像是在页面间穿越一样。该组件需与 [`page-container`](https://developers.weixin.qq.com/miniprogram/dev/component/page-container.html) 组件结合使用。
 * 使用时需在当前页放置 `share-element` 组件，同时在 `page-container` 容器中放置对应的 `share-element` 组件，对应关系通过属性值 key 映射。当设置 `page-container` `显示时，transform` 属性为 `true` 的共享元素会产生动画。当前页面容器退出时，会产生返回动画。
 * @classification viewContainer
 * @supported weapp
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/share-element.html
 */
declare const ShareElement: ComponentType<ShareElementProps>

export { ShareElement, ShareElementProps }
