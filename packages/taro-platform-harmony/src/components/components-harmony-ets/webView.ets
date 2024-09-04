import { AREA_CHANGE_EVENT_NAME, eventHandler, getComponentEventCallback, VISIBLE_CHANGE_EVENT_NAME, createTaroEvent } from '@tarojs/runtime'

import commonStyleModify from './style'
import { shouldBindEvent, getNodeThresholds } from './utils/helper'

import type { TaroAny, TaroEvent, TaroWebViewElement } from '@tarojs/runtime'

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
  @ObjectLink node: TaroWebViewElement

  build () {
    Web({ src: this.node._attrs.src, controller: this.node.controller })
      .attributeModifier(commonStyleModify.setNode(this.node))
      .onPageEnd((e: IPageLoad) => {
        // 1. 创建消息端口
        this.node.ports = this.node.controller.createWebMessagePorts(true)
        // 2. 发送端口1到HTML5
        this.node.controller.postMessage('init_web_messageport', [this.node.ports[1]], '*');
        // 3. 保存端口0到本地
        this.node.nativePort = this.node.ports[0]
        // 4. 设置回调函数
        this.node.nativePort.onMessageEventExt((result) => {
          const message = this.node.handleMessageFromWeb(result)
          const messageEvent: TaroEvent = createTaroEvent('message', { detail: { data: message } }, this.node)

          eventHandler(messageEvent, 'message', this.node)
        })

        const onLoadEvent: TaroEvent = createTaroEvent('load', { detail: { src: this.node._attrs.src } }, this.node)

        eventHandler(onLoadEvent, 'load', this.node)
      })
      .onErrorReceive(shouldBindEvent((e: IError) => {
        const event: TaroEvent = createTaroEvent('error', { detail: { url: this.node._attrs.src, fullUrl: e.request.getRequestUrl() } }, this.node)

        eventHandler(event, 'error', this.node)
      }, this.node, ['error']))
      .onClick(shouldBindEvent((e: ClickEvent) => { eventHandler(e, 'click', this.node) }, this.node, ['click']))
      .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        this.node._nodeInfo.areaInfo = res[1]
      }))
      .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }
}
