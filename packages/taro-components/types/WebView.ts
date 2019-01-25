import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

/**
 * web-view 组件是一个可以用来承载网页的容器，会自动铺满整个小程序页面。个人类型与海外类型的小程序暂不支持使用。
 * @since 1.6.4
 * @see {@link https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html|微信官方文档}
 */
interface WebViewProps extends StandardProps {

  /**
   * webview 指向网页的链接。可打开关联的公众号的文章，其它网页需登录小程序管理后台配置业务域名。
   */
  src: string,

  /**
   * 网页向小程序 postMessage 时，会在特定时机（小程序后退、组件销毁、分享）触发并收到消息。e.detail = { data }
   */
  onMessage?: CommonEventFunction,

  /**
   * 网页加载成功时候触发此事件。e.detail = { src }
   */
  onLoad?: CommonEventFunction,

  /**
   * 网页加载失败的时候触发此事件。e.detail = { src }
   */
  onError?: CommonEventFunction
}

declare const WebView: ComponentType<WebViewProps>

export { WebView }
