import { bindInstanceToNode, bindAnimation, eventHandler, isElement, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, initComponentNodeInfo } from '@tarojs/runtime'

import TaroComponentWrapper from './base'
import { getNodeThresholds, transformW3CToHarmonyInStyle, getNormalAttributes, getFontAttributes, shouldBindEvent } from './utils/helper'

import type { TaroTextElement, TaroTextNode } from '../runtime/index'

@Extend(Text)
function attrs ({
  id,
  width,
  height,
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
  backgroundRepeat,
  backgroundImageSize,
  rotate,
  scale,
  translate,
  transform,
  textAlign,
  flexGrow,
  flexShrink,
  flexBasis,
  alignSelf
 }) {
  .id(id)
  .key(id)
  .constraintSize(constraintSize)
  .flexGrow(flexGrow)
  .flexShrink(flexShrink)
  .flexBasis(flexBasis)
  .alignSelf(alignSelf)
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
  .backgroundImage(backgroundImage, backgroundRepeat)
  .backgroundImageSize(backgroundImageSize)
  .rotate(rotate)
  .scale(scale)
  .translate(translate)
  .transform(transform)
  .textAlign(textAlign)
  .width(width)
  .height(height)
}

@Extend(Span)
function spanAttrs ({
  id,
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
  backgroundRepeat,
  backgroundImageSize,
  rotate,
  scale,
  translate,
  transform,
  textAlign,
  width,
  height,
 }) {
  .id(id)
  .key(id)
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
  .backgroundImage(backgroundImage, backgroundRepeat)
  .backgroundImageSize(backgroundImageSize)
  .textAlign(textAlign)
  .width(width)
  .height(height)
}

function getAttributes (node: TaroElement) {
  const attrs = {
    ...getNormalAttributes(node),
    ...getFontAttributes(node)
  }
  // 处理style属性，运行时转换成鸿蒙样式
  transformW3CToHarmonyInStyle(node._st, attrs)

  return attrs
}

@Component
export struct TaroSpan {
  @ObjectLink node: TaroTextNode | TaroTextElement


  aboutToAppear () {
    // 绑定动画
    bindAnimation(this.node)
  }


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
export default struct TaroText {
  nodeInfoMap: any = {}

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  @ObjectLink node: TaroTextElement

  aboutToAppear () {
    initComponentNodeInfo(this, this.node)
    bindInstanceToNode(this.node, this)
    // 绑定动画
    bindAnimation(this.node)
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
    .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
      const [_, areaResult] = eventResult

      this.nodeInfoMap[this.node._nid].areaInfo = areaResult
    }))
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
        .visibleChangeEvent()
      } else {
        Text(this.node.textContent)
          .defaultEvent()
          .attrs(getAttributes(this.node))
          .visibleChangeEvent()
      }
    }
  }
}
