import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'
interface WebViewProps extends StandardProps {
  /** webview 指向网页的链接。可打开关联的公众号的文章，其它网页需登录小程序管理后台配置业务域名。
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  src: string
  /** webview 的进度条颜色
   * @supported tt
   */
  progressbarColor?: string
  /** 若使用web-view组件引入第三方客服，必须填写type="im"
   * @supported tt
   * @default default
   */
  type?: string
  /** 网页向小程序 postMessage 时，会在特定时机（小程序后退、组件销毁、分享）触发并收到消息。e.detail = { data }
   * @supported weapp, alipay, swan, tt, qq, jd
   */
  onMessage?: CommonEventFunction<WebViewProps.onMessageEventDetail>
  /** 网页加载成功时候触发此事件。e.detail = { src }
   * @supported weapp, alipay, tt, qq, h5, rn
   */
  onLoad?: CommonEventFunction<WebViewProps.onLoadEventDetail>
  /** 网页加载失败的时候触发此事件。e.detail = { src }
   * @supported weapp, alipay, tt, qq, h5, rn
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
 * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony
 * @example_react
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
 * @example_vue
 * ```html
 * <template>
 *   <web-view src='https://mp.weixin.qq.com/' `@message="handleMessage" />
 * </template>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html
 */
declare const WebView: ComponentType<WebViewProps>
export { WebView, WebViewProps }
