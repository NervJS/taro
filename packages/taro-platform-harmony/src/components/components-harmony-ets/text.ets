import { type TaroText, type TaroTextElement, eventHandler, isElement } from '@tarojs/runtime'
import { capitalize } from '@tarojs/shared'

import { AttributeManager } from './utils/AttributeManager'
import { TEXT_DEFAULT_STYLE } from './utils/constant/style'

@Component
struct TaroSpan {
  @ObjectLink node: Text | TaroText

  build() {
    Span(this.node.textContent)
  }
}

// TODO: 使用 @Builder 后，嵌套文本无法渲染出来，但如果不使用 Builder，会出现下面注释说的属性更新失效的问题。
// TODO: 应该需要鸿蒙测解决异步更新时，@Builder 的异常问题后才能正常展示和渲染。
@Builder
function buildSpan (node: Text | TaroText) {
  // @ObjectLink node 直接传递 node.children[item] 给另一个组件的 @ObjectLink 属性，在更新时子组件的属性会变为 undefined
  // 中间增加一层  @Builder 可以解决这个奇怪的问题
  TaroSpan({ node })
}

@Component
struct Text {
  @ObjectLink node: TaroText

  @Styles defaultStyle () {
    .zIndex(AttributeManager.getNodeStyle(this.node, 'zIndex'))
    .opacity(AttributeManager.getNodeStyle(this.node, 'opacity'))
    .margin(AttributeManager.getNodeMarginOrPaddingData(this.node, 'margin'))
    .padding(AttributeManager.getNodeMarginOrPaddingData(this.node, 'padding'))
  }

  @Styles defaultEvent () {
    .onClick((e: ClickEvent) => eventHandler(e, 'click', this.node))
  }

  build() {
    if (this.node.childNodes.findIndex(node => isElement(node) && node.tagName === 'TEXT') > -1) {
      // Text 嵌套 Text。受 Span 限制，最多嵌套一层
      Text() {
        ForEach(this.node.childNodes, node => {
          buildSpan(node)
        }, node => node._nid)
      }
      .defaultStyle()
      .defaultEvent()
      .decoration(AttributeManager.getNodeTextDecoration(this.node))
      .lineHeight(AttributeManager.getNodeStyle(this.node, 'lineHeight'))
      .letterSpacing(AttributeManager.getNodeStyle(this.node, 'letterSpacing'))
      .maxLines(AttributeManager.getNodeStyle(this.node, 'maxLines', Infinity))
      .fontColor(AttributeManager.getNodeStyle(this.node, 'color', TEXT_DEFAULT_STYLE.COLOR))
      .fontSize(AttributeManager.getNodeStyle(this.node, 'fontSize', TEXT_DEFAULT_STYLE.FONT_SIZE))
      .fontWeight(AttributeManager.getNodeStyle(this.node, 'fontWeight', TEXT_DEFAULT_STYLE.FONT_WEIGHT))
      .fontFamily(AttributeManager.getNodeStyle(this.node, 'fontFamily', TEXT_DEFAULT_STYLE.FONT_FAMILY))
      .textOverflow({ overflow: TextOverflow[capitalize(AttributeManager.getNodeStyle(this.node, 'textOverflow', 'none'))] })
    } else {
      Text(this.node.textContent)
        .defaultStyle()
        .defaultEvent()
        .decoration(AttributeManager.getNodeTextDecoration(this.node))
        .lineHeight(AttributeManager.getNodeStyle(this.node, 'lineHeight'))
        .letterSpacing(AttributeManager.getNodeStyle(this.node, 'letterSpacing'))
        .maxLines(AttributeManager.getNodeStyle(this.node, 'maxLines', Infinity))
        .fontColor(AttributeManager.getNodeStyle(this.node, 'color', TEXT_DEFAULT_STYLE.COLOR))
        .fontSize(AttributeManager.getNodeStyle(this.node, 'fontSize', TEXT_DEFAULT_STYLE.FONT_SIZE))
        .fontWeight(AttributeManager.getNodeStyle(this.node, 'fontWeight', TEXT_DEFAULT_STYLE.FONT_WEIGHT))
        .fontFamily(AttributeManager.getNodeStyle(this.node, 'fontFamily', TEXT_DEFAULT_STYLE.FONT_FAMILY))
        .textOverflow({ overflow: TextOverflow[capitalize(AttributeManager.getNodeStyle(this.node, 'textOverflow', 'none'))] })
    }
  }
}

export default Text
