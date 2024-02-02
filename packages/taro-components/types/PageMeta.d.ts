import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'
interface PageMetaProps extends StandardProps {
  /** 下拉背景字体、loading 图的样式，仅支持 dark 和 light
   * @supported weapp
   */
  backgroundTextStyle?: string
  /** 窗口的背景色，必须为十六进制颜色值
   * @supported weapp, alipay
   */
  backgroundColor?: string
  /** 顶部窗口的背景色，必须为十六进制颜色值，仅 iOS 支持
   * @supported weapp, alipay
   */
  backgroundColorTop?: string
  /** 底部窗口的背景色，必须为十六进制颜色值，仅 iOS 支持
   * @supported weapp, alipay
   */
  backgroundColorBottom?: string
  /** 滚动位置，可以使用 px 或者 rpx 为单位，在被设置时，页面会滚动到对应位置
   * @default ""
   * @supported weapp, alipay
   */
  scrollTop?: string
  /** 滚动动画时长
   * @default 300
   * @supported weapp, alipay
   */
  scrollDuration?: number
  /** 页面根节点样式，页面根节点是所有页面节点的祖先节点，相当于 HTML 中的 body 节点
   * @default ""
   * @supported weapp, alipay
   */
  pageStyle?: string
  /** 页面的根字体大小，页面中的所有 rem 单位，将使用这个字体大小作为参考值，即 1rem 等于这个字体大小
   * @default ""
   * @supported weapp, alipay
   */
  rootFontSize?: string
  /** 页面内容的背景色，用于页面中的空白部分和页面大小变化 resize 动画期间的临时空闲区域
   * @supported weapp, alipay
   */
  rootBackgroundColor?: string
  /** 页面 page 的字体大小，可以设置为 system ，表示使用当前用户设置的微信字体大小
   * @supported weapp, alipay
   */
  pageFontSize?: string
  /** 页面的方向，可为 auto portrait 或 landscape
   * @supported weapp
   */
  pageOrientation?: string
  /** 页面尺寸变化时会触发 resize 事件
   * @supported weapp
   */
  onResize?: CommonEventFunction<PageMetaProps.onResizeEventDetail>
  /** 页面滚动时会触发 scroll 事件
   * @supported weapp, alipay
   */
  onScroll?: CommonEventFunction<PageMetaProps.onScrollEventDetail>
  /** 如果通过改变 scroll-top 属性来使页面滚动，页面滚动结束后会触发 scrolldone 事件
   * @supported weapp
   */
  onScrollDone?: CommonEventFunction
}
declare namespace PageMetaProps {
  interface onResizeEventDetail {
    /** 设备方向 */
    deviceOrientation?: 'portrait' | 'landscape'
    /** 窗口尺寸 */
    size: resizeType
  }
  /** 窗口尺寸类型 */
  interface resizeType {
    /** 窗口宽度 */
    windowWidth: number
    /** 窗口高度 */
    windowHeight: number
    /** 屏幕宽度 */
    screenWidth?: number
    /** 屏幕高度 */
    screenHeight?: number
  }
  interface onScrollEventDetail {
    scrollTop: number
  }
}
/** 页面属性配置节点，用于指定页面的一些属性、监听页面事件。只能是页面内的第一个节点。可以配合 navigation-bar 组件一同使用。
 * 通过这个节点可以获得类似于调用 Taro.setBackgroundTextStyle Taro.setBackgroundColor 等接口调用的效果。
 *
 * :::info
 * Taro v3.6.19 开始支持
 * 开发者需要在页面配置里添加：`enablePageMeta: true`
 * :::
 *
 * @supported weapp, alipay
 * @example_react
 * ```tsx
 * // page.config.ts
 * export default definePageConfig({ enablePageMeta: true, ... })
 *
 * // page.tsx
 * function Index () {
 *   return (
 *     <View>
 *      <PageMeta
 *        pageStyle={myPageStyle}
 *        onScroll={handleScroll}
 *      >
 *        <NavigationBar title={title} />
 *      </PageMeta>
 *    </View>
 *   )
 * }
 * ```
 * @example_vue
 * ```html
 * <!-- page.config.ts -->
 * <!-- export default definePageConfig({ enablePageMeta: true, ... }) -->
 *
 * <!-- page.vue -->
 * <template>
 *   <page-meta
 *     :page-style="myPageStyle"
 *     `@scroll="handleScroll"
 *   >
 *     <navigation-bar :title="title" />
 *   </page-meta>
 * </template>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/page-meta.html
 */
declare const PageMeta: ComponentType<PageMetaProps>
export { PageMeta, PageMetaProps }
