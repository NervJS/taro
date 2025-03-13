import { TaroNativeModule } from '@tarojs/plugin-platform-harmony-cpp/dist/runtime/runtime-harmony'
import web_webview from '@ohos.web.webview'

// import commonStyleModify from './style'
// import { getComponentEventCallback } from './utils/info'

import type { TaroAny, TaroWebViewElement, TaroEvent } from '@tarojs/runtime'

interface IPageLoad {
  url: string
}

interface IError {
  request: WebResourceRequest
  error: WebResourceError
}

@Component
export default struct TaroWebView {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroWebViewElement, layer?: number) => void = this.customBuilder
  @Prop node: TaroWebViewElement

  aboutToAppear(): void {
    this.node._attrs ||= {}
    this.node._attrs.src = TaroNativeModule.getTaroNodeAttribute(this.node._nid, 'src')

    this.node.controller = new web_webview.WebviewController() as TaroAny
    this.node.message = new web_webview.WebMessageExt() as TaroAny

    this.node._nodeInfo ||= {}
  }

  build () {
    Web({ src: this.node._attrs.src, controller: this.node.controller })
      // .attributeModifier(commonStyleModify.setNode(this.node))
      .onPageEnd((e: IPageLoad) => {
        // 1. 创建消息端口
        this.node.ports = this.node.controller.createWebMessagePorts(true)
        // 2. 发送端口1到HTML5
        this.node.controller.postMessage('init_web_messageport', [this.node.ports[1]], '*');
        // 3. 保存端口0到本地
        this.node.nativePort = this.node.ports[0]
        // 4. 设置回调函数
        this.node.nativePort.onMessageEventExt((result) => {
          const message: TaroAny = this.node.handleMessageFromWeb(result)
          TaroNativeModule.triggerEvent(this.node._nid, 'message', { detail: { data: message } })
        })

        TaroNativeModule.triggerEvent(this.node._nid, 'load', { detail: { src: this.node._attrs.src } })
      })
      .onErrorReceive((e: IError) => {
        TaroNativeModule.triggerEvent(this.node._nid, 'error', { detail: { url: this.node._attrs.src, fullUrl: e.request.getRequestUrl() } })
      })
      // .onAreaChange(getComponentEventCallback(this.node, 'areaChange', (res: TaroAny) => {
      //   this.node._nodeInfo.areaInfo = res[1]
      // }))
      // .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, 'visibleChange'))
  }
}
