import { eventHandler, isElement } from '@tarojs/runtime'
import { capitalize } from '@tarojs/shared'

import TaroComponentWrapper from './base'
import { AttributeManager } from './utils/AttributeManager'
import { TEXT_DEFAULT_STYLE } from './utils/constant/style'
import { bindInstanceToNode, getNormalAttributes } from './utils/helper'

import type { TaroTextElement, TaroTextNode } from '../runtime/index'

@Extend(Text)
function attrs ({
  zIndex,
  opacity,
  margin,
  padding,
  decoration,
  lineHeight,
  letterSpacing,
  maxLines,
  fontColor,
  fontSize,
  fontWeight,
  fontFamily,
  textOverflow,
  constraintSize,
  border,
  borderRadius,
  backgroundColor,
  backgroundImage,
  backgroundImageSize
 }) {
  .constraintSize(constraintSize)
  .zIndex(zIndex)
  .opacity(opacity)
  .margin(margin)
  .padding(padding)
  .decoration(decoration)
  .lineHeight(lineHeight)
  .letterSpacing(letterSpacing)
  .maxLines(maxLines)
  .fontColor(fontColor)
  .fontSize(fontSize)
  .fontWeight(fontWeight)
  .fontFamily(fontFamily)
  .textOverflow(textOverflow)
  .border(border)
  .borderRadius(borderRadius)
  .backgroundColor(backgroundColor)
  .backgroundImage(backgroundImage)
  .backgroundImageSize(backgroundImageSize)
}

@Extend(Span)
function spanAttrs ({
  zIndex,
  opacity,
  margin,
  padding,
  decoration,
  lineHeight,
  letterSpacing,
  fontColor,
  fontSize,
  fontWeight,
  fontFamily,
  constraintSize,
  border,
  borderRadius,
  backgroundColor,
  backgroundImage,
  backgroundImageSize
 }) {
  .constraintSize(constraintSize)
  .zIndex(zIndex)
  .opacity(opacity)
  .margin(margin)
  .padding(padding)
  .decoration(decoration)
  .lineHeight(lineHeight)
  .letterSpacing(letterSpacing)
  .fontColor(fontColor)
  .fontSize(fontSize)
  .fontWeight(fontWeight)
  .fontFamily(fontFamily)
  .border(border)
  .borderRadius(borderRadius)
  .backgroundColor(backgroundColor)
  .backgroundImage(backgroundImage)
  .backgroundImageSize(backgroundImageSize)
}

function getAttributes (node: TaroElement) {
  return {
    ...getNormalAttributes(node),
    ...getFontAttributes(node)
  }
}

function getFontAttributes (node: TaroElement) {
  const { _st } = node

  return {
    decoration: AttributeManager.getNodeTextDecoration(_st),
    lineHeight: AttributeManager.getNodeStyle(_st, 'lineHeight'),
    letterSpacing: AttributeManager.getNodeStyle(_st, 'letterSpacing'),
    maxLines: +AttributeManager.getNodeStyle(_st, 'WebkitLineClamp', Infinity),
    fontColor: AttributeManager.getNodeStyle(_st, 'color', TEXT_DEFAULT_STYLE.COLOR),
    fontSize: AttributeManager.getNodeStyle(_st, 'fontSize', TEXT_DEFAULT_STYLE.FONT_SIZE),
    fontWeight: AttributeManager.getNodeStyle(_st, 'fontWeight', TEXT_DEFAULT_STYLE.FONT_WEIGHT),
    fontFamily: AttributeManager.getNodeStyle(_st, 'fontFamily', TEXT_DEFAULT_STYLE.FONT_FAMILY),
    textOverflow: { overflow: TextOverflow[capitalize(AttributeManager.getNodeStyle(_st, 'textOverflow', 'none'))] }
  }
}

@Component
struct TaroSpan {
  @ObjectLink node: TaroTextNode | TaroTextElement

  build() {
    Span(this.node.textContent).spanAttrs(getAttributes(this.node))
  }
}

// TODO: 使用 @Builder 后，嵌套文本无法渲染出来，但如果不使用 Builder，会出现下面注释说的属性更新失效的问题。
// TODO: 应该需要鸿蒙测解决异步更新时，@Builder 的异常问题后才能正常展示和渲染。
@Builder
function buildSpan (node: TaroTextNode | TaroTextElement) {
  // @ObjectLink node 直接传递 node.children[item] 给另一个组件的 @ObjectLink 属性，在更新时子组件的属性会变为 undefined
  // 中间增加一层  @Builder 可以解决这个奇怪的问题
  TaroSpan({ node })
}

@Component
struct TaroText {
  info: Area = null

  @ObjectLink node: TaroTextElement

  aboutToAppear () {
    bindInstanceToNode(this.node, this)
  }

  @Styles defaultEvent () {
    .onClick((e: ClickEvent) => eventHandler(e, 'click', this.node))
    .onAreaChange((_: Area, areaResult: Area) => {
      this.info = areaResult
    })
  }


  build() {
    TaroComponentWrapper({ node: this.node }) {
      if (this.node.childNodes.findIndex(node => isElement(node) && node.tagName === 'TEXT') > -1) {
        // Text 嵌套 Text。受 Span 限制，最多嵌套一层
        Text() {
          ForEach(this.node.childNodes, node => {
            buildSpan(node)
          }, node => node._nid)
        }
        .defaultEvent()
        .attrs(getAttributes(this.node))
      } else {
        Text(this.node.textContent)
          .defaultEvent()
          .attrs(getAttributes(this.node))
      }
    }
  }
}

export default TaroText
