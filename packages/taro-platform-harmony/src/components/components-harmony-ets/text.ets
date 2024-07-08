import { isString } from '@tarojs/shared'
import { eventHandler, convertNumber2VP, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, NodeType } from '@tarojs/runtime'

import commonStyleModify, { textModify, setNormalTextAttributeIntoInstance } from './style'
import { getButtonColor } from './button'
import { getImageMode } from './image'
import { BUTTON_THEME_COLOR } from './utils/constant/style'
import { getNodeThresholds, getStyleAttr, shouldBindEvent, getNormalAttributes } from './utils/helper'

import type { HarmonyStyle, TaroAny, TaroButtonElement, TaroElement, TaroTextElement } from '@tarojs/runtime'

function getButtonFontSize (node: TaroButtonElement): string | number {
  const isMini = node._attrs.size === 'mini'

  return isMini ? convertNumber2VP(26) : convertNumber2VP(36)
}

function getTextInViewWidth (node: TaroElement | null): TaroAny {
  if (node) {
    const hmStyle = node.hmStyle || {}
    const isFlexView = hmStyle.display === 'flex'
    const width: TaroAny = getStyleAttr(node, 'width')
    const isPercentWidth = isString(width) && width.includes('%')

    return isFlexView || isPercentWidth ? null : getStyleAttr(node, 'width')
  }
}


@Component
export default struct TaroText {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroTextElement, layer?: number) => void = this.customBuilder
  @ObjectLink node: TaroTextElement
  @State overwriteStyle: Record<string, TaroAny> = {}

  aboutToAppear(): void {
    if (this.node) {
      this.node._instance = this
    }
  }

  build () {
    if (this.node.nodeType === NodeType.TEXT_NODE) {
      if (this.node.parentNode) {
        if ((this.node.parentNode as TaroElement).tagName === 'BUTTON') {
          Text(this.node.textContent)
            .attributeModifier(textModify.setNode(this.node?.parentElement as TaroElement, {
              fontSize: getButtonFontSize(this.node.parentNode as TaroButtonElement),
              color: getButtonColor(this.node.parentNode as TaroButtonElement, BUTTON_THEME_COLOR.get((this.node.parentNode as TaroButtonElement)._attrs.type || '').text)
            }))
        } else {
          Text(this.node.textContent)
            .attributeModifier(textModify.setNode(this.node?.parentElement as TaroElement))
            .width(getTextInViewWidth(this.node.parentElement))
        }
      }
    } else {
      Text(this.node.textContent) {
        // text 下还有标签
        if (this.node.childNodes.length > 1 || ((this.node.childNodes[0] && this.node.childNodes[0] as TaroElement)?.nodeType === NodeType.ELEMENT_NODE)) {
          ForEach(this.node.childNodes, (item: TaroElement) => {
            if (item.tagName === 'IMAGE') {
              ImageSpan(item.getAttribute('src'))
                .attributeModifier(commonStyleModify.setNode(item))
                .objectFit(getImageMode(item.getAttribute('mode')))
                .verticalAlign(getImageSpanAlignment(this.node?.hmStyle?.verticalAlign))
                .onClick(shouldBindEvent((e: ClickEvent) => { eventHandler(e, 'click', item) }, item, ['click']))
            } else if (item.nodeType === NodeType.TEXT_NODE) {
              Span(item.textContent)
            } else if (item.tagName === 'TEXT') {
              Span(item.textContent)
                .attributeModifier(spanModify.setNode(item))
                .letterSpacing(item._st.hmStyle.letterSpacing)
                .textBackgroundStyle({
                  color: item._st.hmStyle.backgroundColor,
                  radius: {
                    topLeft: item._st.hmStyle.borderTopLeftRadius,
                    topRight: item._st.hmStyle.borderTopRightRadius,
                    bottomLeft: item._st.hmStyle.borderBottomLeftRadius,
                    bottomRight: item._st.hmStyle.borderBottomRightRadius,
                  }
                })
                .onClick(shouldBindEvent((e: ClickEvent) => { eventHandler(e, 'click', item) }, item, ['click']))
            }
          }, (item: TaroElement) => `${item._nid}${this.node._updateTrigger}`)
        }
      }
      .onClick(shouldBindEvent((e: ClickEvent) => { eventHandler(e, 'click', this.node) }, this.node, ['click']))
      .attributeModifier(textModify.setNode(this.node).withNormalStyle().setAnimationStyle(this.overwriteStyle))
      .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        this.node._nodeInfo.areaInfo = res[1]
      }))
    }
  }
}

function getImageSpanAlignment (align: TaroAny): TaroAny {
  if (align === Alignment.Top) {
    return ImageSpanAlignment.TOP
  } else if (align === Alignment.Bottom) {
    return ImageSpanAlignment.BOTTOM
  } else if (align === Alignment.Center) {
    return ImageSpanAlignment.CENTER
  }
}

class SpanStyleModify implements AttributeModifier<SpanAttribute> {
  node: TaroTextElement | null = null
  style: HarmonyStyle | null = null
  overwriteStyle: Record<string, TaroAny> = {}
  withNormal = false

  setNode (node: TaroTextElement) {
    this.node = node
    this.style = getNormalAttributes(this.node)
    return this
  }

  applyNormalAttribute(instance: SpanAttribute): void {
    if (this.node && this.style) {
      setNormalTextAttributeIntoInstance(instance, this.style, this.node)
    }
  }
}

const spanModify = new SpanStyleModify()
