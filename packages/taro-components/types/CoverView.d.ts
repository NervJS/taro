import { ComponentType } from 'react'
import { ViewProps } from './View'

interface CoverViewProps extends ViewProps {
  /** 设置顶部滚动偏移量，仅在设置了 overflow-y: scroll 成为滚动元素后生效
   * @supported weapp
   */
  scrollTop?: number
}

/** 覆盖在原生组件之上的文本视图。可覆盖的原生组件包括 map、video、canvas、camera、live-player、live-pusher 只支持嵌套 cover-view、cover-image，可在 cover-view 中使用 button。
 * @classification viewContainer
 * @supported weapp, swan, alipay
 * @example
 * ```tsx
 * class App extends Components {
 *   render () {
 *     return (
 *       <Video id='myVideo' src='src'>
 *         <CoverView class='controls'>
 *           <CoverView class='play' onClick='play'>
 *             <CoverImage class='img' src='src' />
 *           </CoverView>
 *         </CoverView>
 *       </Video>
 *     )
 *   }
 * }
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/cover-view.html
 */
declare const CoverView: ComponentType<CoverViewProps>

export { CoverView, CoverViewProps }
