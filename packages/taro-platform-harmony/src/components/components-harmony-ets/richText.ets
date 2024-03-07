import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME } from '@tarojs/runtime'

import commonStyleModify from './style'
import { getNodeThresholds, shouldBindEvent } from './utils/helper'

import type { RichTextProps } from '@tarojs/components/types/RichText'
import type { TaroAny, TaroRichTextElement } from '@tarojs/runtime'

function generateText (node: TaroRichTextElement): string {
  return parseHtmlNode(node._attrs.nodes || '')
}

@Component
export default struct TaroRichText {
  @ObjectLink node: TaroRichTextElement

  build () {
    if (this.node.hmStyle?.display !== 'none') {
      RichText(generateText(this.node))
        .attributeModifier(commonStyleModify.setNode(this.node))
        .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
        .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          this.node._nodeInfo.areaInfo = res[1]
        }))
        .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
    }
  }
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
