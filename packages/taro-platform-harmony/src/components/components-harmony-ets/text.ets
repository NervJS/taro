import { eventHandler, isElement, convertNumber2PX } from '@tarojs/runtime'
import { capitalize } from '@tarojs/shared'

import TaroComponentWrapper from './base'
import { AttributeManager } from './utils/AttributeManager'
import { TEXT_DEFAULT_STYLE } from './utils/constant/style'
import { bindInstanceToNode, bindAnimation, getNormalAttributes, shouldBindEvent, getNodeAreaChange } from './utils/helper'

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
  backgroundImageSize,
  rotate,
  scale,
  translate,
  transform
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
  .rotate(rotate)
  .scale(scale)
  .translate(translate)
  .transform(transform)
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
  backgroundImageSize,
  rotate,
  scale,
  translate,
  transform
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

function getAttributes (node: TaroElement, overwriteStyle: Record<string, any>) {
  return {
    ...getNormalAttributes(node, overwriteStyle),
    ...getFontAttributes(node)
  }
}

function getFontAttributes (node: TaroElement) {
  const { _st } = node

  let lineHeight = AttributeManager.getNodeStyle(_st, 'lineHeight')
  if (lineHeight && typeof lineHeight === 'number') {
    lineHeight = convertNumber2PX(lineHeight)
  }
  return {
    decoration: AttributeManager.getNodeStyle(_st, 'textDecoration'),
    lineHeight: lineHeight,
    letterSpacing: AttributeManager.getNodeStyle(_st, 'letterSpacing'),
    maxLines: +AttributeManager.getNodeStyle(_st, 'WebkitLineClamp', Infinity),
    fontColor: AttributeManager.getNodeStyle(_st, 'color', TEXT_DEFAULT_STYLE.COLOR),
    fontSize: AttributeManager.getNodeStyle(_st, 'fontSize', TEXT_DEFAULT_STYLE.FONT_SIZE),
    fontWeight: AttributeManager.getNodeStyle(_st, 'fontWeight', TEXT_DEFAULT_STYLE.FONT_WEIGHT),
    fontFamily: AttributeManager.getNodeStyle(_st, 'fontFamily', TEXT_DEFAULT_STYLE.FONT_FAMILY),
    textOverflow: { overflow: TextOverflow[capitalize(AttributeManager.getNodeStyle(_st, 'textOverflow', 'none'))] },
    textAlign: AttributeManager.getTextAlign(_st)
  }
}

@Component
struct TaroSpan {
  @ObjectLink node: TaroTextNode | TaroTextElement

  @State overwriteStyle: Record<string, any> = {}
  
  aboutToAppear () {
    // 绑定动画
    bindAnimation(this.node, (rule) => {
      this.overwriteStyle = rule
    })
  }


  build() {
    Span(this.node.textContent).spanAttrs(getAttributes(this.node, this.overwriteStyle))
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

  @State thresholds: number[] = []

  @State isAreaChangeTap: boolean = false

  @State overwriteStyle: Record<string, any> = {}

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(this.thresholds || [0.0, 1.0], (isVisible: boolean, currentRatio: number) => {
      this.visableChange?.(isVisible, currentRatio)
    })
  }

  @ObjectLink node: TaroTextElement

  aboutToAppear () {
    bindInstanceToNode(this.node, this)
    // 绑定动画
    bindAnimation(this.node, (rule) => {
      this.overwriteStyle = rule
    })
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
    .onAreaChange(getNodeAreaChange((areaResult: Area) => {
      this.info = areaResult
    }, this))
  }


  build() {
    TaroComponentWrapper({ node: this.node }) {
      if (!this.thresholds.length) {
        if (this.node.childNodes.findIndex(node => isElement(node) && node.tagName === 'TEXT') > -1) {
          // Text 嵌套 Text。受 Span 限制，最多嵌套一层
          Text() {
            ForEach(this.node.childNodes, node => {
              buildSpan(node)
            }, node => node._nid)
          }
          .defaultEvent()
          .attrs(getAttributes(this.node, this.overwriteStyle))
        } else {
          Text(this.node.textContent)
            .defaultEvent()
            .attrs(getAttributes(this.node, this.overwriteStyle))
        }
      } else {
        if (this.node.childNodes.findIndex(node => isElement(node) && node.tagName === 'TEXT') > -1) {
          // Text 嵌套 Text。受 Span 限制，最多嵌套一层
          Text() {
            ForEach(this.node.childNodes, node => {
              buildSpan(node)
            }, node => node._nid)
          }
          .defaultEvent()
          .attrs(getAttributes(this.node, this.overwriteStyle))
          .visibleChangeEvent()
        } else {
          Text(this.node.textContent)
            .defaultEvent()
            .attrs(getAttributes(this.node, this.overwriteStyle))
            .visibleChangeEvent()
        }
      }
    }
  }
}

export default TaroText
