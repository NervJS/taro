import { AREA_CHANGE_EVENT_NAME, eventHandler, getComponentEventCallback, VISIBLE_CHANGE_EVENT_NAME, createTaroEvent } from '@tarojs/runtime'

import { getNormalAttributes, shouldBindEvent, getNodeThresholds } from './utils/helper'

import type { TaroAny, TaroWebViewElement, TaroStyleType, TaroEvent } from '@tarojs/runtime'

interface IPageLoad {
  url: string
}

interface IError {
  request: WebResourceRequest
  error: WebResourceError
}

@Extend(Web)
function attrs (style: TaroStyleType) {
  .id(style.id)
  .key(style.id)
  .flexGrow(style.flexGrow)
  .flexShrink(style.flexShrink)
  .flexBasis(style.flexBasis)
  .alignSelf(style.alignSelf)
  .padding({
    top: style.paddingTop,
    right: style.paddingRight,
    bottom: style.paddingBottom,
    left: style.paddingLeft
  })
  .margin({
    top: style.marginTop,
    right: style.marginRight,
    bottom: style.marginBottom,
    left: style.marginLeft
  })
  .width(style.width)
  .height(style.height)
  .constraintSize({
    minWidth: style.minWidth,
    maxWidth: style.maxWidth,
    minHeight: style.minHeight,
    maxHeight: style.maxHeight
  })
  .backgroundColor(style.backgroundColor)
  .backgroundImage(style.backgroundImage?.src, style.backgroundRepeat)
  .backgroundImageSize(style.backgroundSize)
  .backgroundImagePosition(style.backgroundPosition)
  .borderStyle({
    top: style.borderTopStyle,
    right: style.borderRightStyle,
    bottom: style.borderBottomStyle,
    left: style.borderLeftStyle
  })
  .borderWidth({
    top: style.borderTopWidth,
    right: style.borderRightWidth,
    bottom: style.borderBottomWidth,
    left: style.borderLeftWidth
  })
  .borderColor({
    top: style.borderTopColor,
    right: style.borderRightColor,
    bottom: style.borderBottomColor,
    left: style.borderLeftColor
  })
  .borderRadius({
    topLeft: style.borderTopLeftRadius,
    topRight: style.borderTopRightRadius,
    bottomLeft: style.borderBottomLeftRadius,
    bottomRight: style.borderBottomRightRadius
  })
  .zIndex(style.zIndex)
  .opacity(style.opacity)
  .clip(style.overflow)
  .rotate({ centerX: style.transformOrigin?.x, centerY: style.transformOrigin?.y, angle: 0 })
  .scale({ centerX: style.transformOrigin?.x, centerY: style.transformOrigin?.y })
  .transform(style.transform)
}

@Builder
export default function TaroWebView (node: TaroWebViewElement) {
  Web({ src: node._attrs.src, controller: node.controller })
    .attrs(getNormalAttributes(node))
    .onPageEnd((e: IPageLoad) => {
      // 1. 创建消息端口
      node.ports = node.controller.createWebMessagePorts(true)
      // 2. 发送端口1到HTML5
      node.controller.postMessage('init_web_messageport', [node.ports[1]], '*');
      // 3. 保存端口0到本地
      node.nativePort = node.ports[0]
      // 4. 设置回调函数
      node.nativePort.onMessageEventExt((result) => {
        const message = node.handleMessageFromWeb(result)
        const messageEvent: TaroEvent = createTaroEvent('message', { detail: { data: message } }, node)

        eventHandler(messageEvent, 'message', node)
      })

      const onLoadEvent: TaroEvent = createTaroEvent('load', { detail: { src: node._attrs.src } }, node)

      eventHandler(onLoadEvent, 'load', node)
    })
    .onErrorReceive(shouldBindEvent((e: IError) => {
      const event: TaroEvent = createTaroEvent('error', { detail: { url: node._attrs.src, fullUrl: e.request.getRequestUrl() } }, node)
      
      eventHandler(event, 'error', node)
    }, node, ['error']))
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', node), node, ['click']))
    .onAreaChange(getComponentEventCallback(node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      node._nodeInfo.areaInfo = res[1]
    }))
    .onVisibleAreaChange(getNodeThresholds(node) || [0.0, 1.0], getComponentEventCallback(node, VISIBLE_CHANGE_EVENT_NAME))
}
