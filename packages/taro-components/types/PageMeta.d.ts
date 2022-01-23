import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

interface PageMetaProps extends StandardProps {
  /** 下拉背景字体、loading 图的样式，仅支持 dark 和 light
   * @supported weapp
   */
  backgroundTextStyle?: string

  /** 窗口的背景色，必须为十六进制颜色值
   * @supported weapp
   */
  backgroundColor?: string

  /** 顶部窗口的背景色，必须为十六进制颜色值，仅 iOS 支持
   * @supported weapp
   */
  backgroundColorTop?: string

  /** 底部窗口的背景色，必须为十六进制颜色值，仅 iOS 支持
   * @supported weapp
   */
  backgroundColorBottom?: string

  /** 滚动位置，可以使用 px 或者 rpx 为单位，在被设置时，页面会滚动到对应位置
   * @default ""
   * @supported weapp
   */
  scrollTop?: string

  /** 滚动动画时长
   * @default 300
   * @supported weapp
   */
  scrollDuration?: number

  /** 页面根节点样式，页面根节点是所有页面节点的祖先节点，相当于 HTML 中的 body 节点
   * @default ""
   * @supported weapp
   */
  pageStyle?: string

  /** 页面的根字体大小，页面中的所有 rem 单位，将使用这个字体大小作为参考值，即 1rem 等于这个字体大小
   * @default ""
   * @supported weapp
   */
  rootFontSize?: string

  /** 页面尺寸变化时会触发 resize 事件，event.detail = { size: { windowWidth, windowHeight } }
   * @supported weapp
   */
  onResize?: CommonEventFunction<PageMetaProps.onResizeEventDetail>

  /** 页面滚动时会触发 scroll 事件，event.detail = { scrollTop }
   * @supported weapp
   */
  onScroll?: CommonEventFunction<PageMetaProps.onScrollEventDetail>

  /** 如果通过改变 scroll-top 属性来使页面滚动，页面滚动结束后会触发 scrolldone 事件
   * @supported weapp
   */
  onScrollDone?: CommonEventFunction
}

declare namespace PageMetaProps {
  interface onResizeEventDetail {
    /** 窗口尺寸 */
    size: resizeType
  }
  /** 窗口尺寸类型 */
  interface resizeType {
    /** 窗口宽度 */
    windowWidth: number
    /** 窗口高度 */
    windowHeight: number
  }
  interface onScrollEventDetail {
    scrollTop: number
  }
}

/** 页面属性配置节点，用于指定页面的一些属性、监听页面事件。只能是页面内的第一个节点。可以配合 navigation-bar 组件一同使用。
 * 通过这个节点可以获得类似于调用 Taro.setBackgroundTextStyle Taro.setBackgroundColor 等接口调用的效果。
 * @supported weapp
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/page-meta.html
 */
declare const PageMeta: ComponentType<PageMetaProps>

export { PageMeta, PageMetaProps }
