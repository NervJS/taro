import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

interface WebViewProps extends StandardProps {
  /** webview 指向网页的链接。可打开关联的公众号的文章，其它网页需登录小程序管理后台配置业务域名。
   * @supported weapp
   */
  src: string

  /** 网页向小程序 postMessage 时，会在特定时机（小程序后退、组件销毁、分享）触发并收到消息。e.detail = { data }
   * @supported weapp
   */
  onMessage?: CommonEventFunction<WebViewProps.onMessageEventDetail>

  /** 网页加载成功时候触发此事件。e.detail = { src }
   * @supported weapp
   */
  onLoad?: CommonEventFunction<WebViewProps.onLoadEventDetail>

  /** 网页加载失败的时候触发此事件。e.detail = { src }
   * @supported weapp
   */
  onError?: CommonEventFunction<WebViewProps.onErrorEventDetail>
}

declare namespace WebViewProps {
  interface onMessageEventDetail {
    /** 消息数据，是多次 postMessage 的参数组成的数组 */
    data: any[]
  }
  interface onLoadEventDetail {
    /** 网页链接 */
    src: string
  }
  interface onErrorEventDetail {
    /** 网页链接 */
    src: string
  }
}

/** web-view 组件是一个可以用来承载网页的容器，会自动铺满整个小程序页面。个人类型与海外类型的小程序暂不支持使用。
 * @classification open
 * @supported weapp, rn
 * @example
 * ```tsx
 * class App extends Component {
 *   handleMessage () {}
 *   
 *   render () {
 *     return (
 *       <WebView src='https://mp.weixin.qq.com/' onMessage={this.handleMessage} />
 *     )
 *   }
 * }
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html
 */
declare const WebView: ComponentType<WebViewProps>

export { WebView, WebViewProps }
