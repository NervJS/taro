/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

interface WebViewProps extends StandardProps {
  /** webview 指向网页的链接。可打开关联的公众号的文章，其它网页需登录小程序管理后台配置业务域名。
   * @supported weapp, h5
   */
  src: string

  /** 网页向小程序 postMessage 时，会在特定时机（小程序后退、组件销毁、分享）触发并收到消息。e.detail = { data }
   * @supported weapp
   */
  onMessage?: CommonEventFunction<WebViewProps.onMessageEventDetail>

  /** 网页加载成功时候触发此事件。e.detail = { src }
   * @supported weapp, h5
   */
  onLoad?: CommonEventFunction<WebViewProps.onLoadEventDetail>

  /** 网页加载失败的时候触发此事件。e.detail = { src }
   * @supported weapp, h5
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
 * @supported weapp, h5, rn
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
