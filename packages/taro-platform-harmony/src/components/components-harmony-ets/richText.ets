import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME } from '@tarojs/runtime'


import { getNodeThresholds, getNormalAttributes, shouldBindEvent } from './utils/helper'

import type { RichTextProps } from '@tarojs/components/types/RichText'
import type { TaroAny, TaroStyleType, TaroRichTextElement } from '@tarojs/runtime'

@Extend(RichText)
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
  .linearGradient(style.linearGradient)
  .clip(style.overflow)
  .rotate({ centerX: style.transformOrigin?.x, centerY: style.transformOrigin?.y, angle: 0 })
  .scale({ centerX: style.transformOrigin?.x, centerY: style.transformOrigin?.y })
  .transform(style.transform)
}


function generateText (node: TaroRichTextElement): string {
  return parseHtmlNode(node._attrs.nodes || '')
}

@Builder
export default function TaroRichText (node: TaroRichTextElement) {
  RichText(generateText(node))
    .attrs(getNormalAttributes(node))
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', node), node, ['click']))
    .onAreaChange(getComponentEventCallback(node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      node._nodeInfo.areaInfo = res[1]
    }))
    .onVisibleAreaChange(getNodeThresholds(node) || [0.0, 1.0], getComponentEventCallback(node, VISIBLE_CHANGE_EVENT_NAME))
}

// 将nodeTree转换成harmony需要的string结构
function nodeToHtml(node: RichTextProps.Text | RichTextProps.HTMLElement): string {
  if (node.type === 'text') {
    return node.text;
  }
  if (node.attrs) {
    const attributes = Object.entries(node.attrs)
      .map((item: [string, string]) => `${item[0]}="${item[1]}"`)
      .join(' ');
    const childrenHtml: string = typeof node.children === 'string' ? node.children : (node.children || []).map((child: RichTextProps.Text | RichTextProps.HTMLElement) => nodeToHtml(child)).join('');
    return `<${node.name}${attributes ? ' ' + attributes : ''}>${childrenHtml}</${node.name}>`;
  }
  return ''
}

function parseHtmlNode (nodes: Array<RichTextProps.Text | RichTextProps.HTMLElement> | string) {
  return typeof nodes === 'string' ? nodes: `<div>${nodes.map(node => nodeToHtml(node)).join('')}</div>`
}
