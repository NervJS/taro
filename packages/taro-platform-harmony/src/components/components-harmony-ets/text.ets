import { bindInstanceToNode, bindAnimation, eventHandler, isElement, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, initComponentNodeInfo } from '@tarojs/runtime'

import TaroComponentWrapper from './base'
import { getNodeThresholds, transformW3CToHarmonyInStyle, getNormalAttributes, getFontAttributes, shouldBindEvent } from './utils/helper'

import type { TaroTextNode } from '@tarojs/runtime'
import type { TaroTextElement, TaroElement } from './utils/element'
import type { TaroStyleType, CompType } from './type'
import type { TaroAny } from './utils/type'

@Extend(Text)
function textStyle (style: TaroStyleType) {
  .id(style.id)
  .key(style.id)
  .padding(style.padding)
  .margin(style.margin)
  .width(style.width)
  .height(style.height)
  .constraintSize(style.constraintSize)
  .flexGrow(style.flexGrow)
  .flexShrink(style.flexShrink)
  .flexBasis(style.flexBasis)
  .alignSelf(style.alignSelf)
  .backgroundColor(style.backgroundColor)
  .backgroundImage(style.backgroundImage, style.backgroundRepeat)
  .backgroundImageSize(style.backgroundImageSize)
  .rotate(style.rotate)
  .scale(style.scale)
  .translate(style.translate)
  .transform(style.transform)
  .borderStyle(style.borderStyle)
  .borderWidth(style.borderWidth)
  .borderColor(style.borderColor)
  .borderRadius(style.borderRadius)
  .linearGradient(style.linearGradient)
  .zIndex(style.zIndex)
  .opacity(style.opacity)
  .clip(style.clip)
  .fontColor(style.color)
  .fontSize(style.fontSize)
  .fontWeight(style.fontWeight)
  .fontStyle(style.fontStyle)
  .fontFamily(style.fontFamily)
  .lineHeight(style.lineHeight)
  .decoration({
    type: style.decoration,
    color: style.color
  })
}

@Extend(Text)
function textAttr(attr: CompType.Text.Attrs) {
  .textAlign(attr.textAlign)
  .textOverflow(attr.textOverflow)
  .maxLines(attr.maxLines)
  .letterSpacing(attr.letterSpacing)
}


//
// @Extend(Span)
// function spanAttrs (style: TaroStyleType) {
//   .id(style.id)
//   .key(style.id)
//   .padding(style.padding)
//   .margin(style.margin)
//   .width(style.width)
//   .height(style.height)
//   .constraintSize(style.constraintSize)
//   .flexGrow(style.flexGrow)
//   .flexShrink(style.flexShrink)
//   .flexBasis(style.flexBasis)
//   .alignSelf(style.alignSelf)
//   .backgroundColor(style.backgroundColor)
//   .backgroundImage(style.backgroundImage, style.backgroundRepeat)
//   .backgroundImageSize(style.backgroundImageSize)
//   .rotate(style.rotate)
//   .scale(style.scale)
//   .translate(style.translate)
//   .transform(style.transform)
//   .borderStyle(style.borderStyle)
//   .borderWidth(style.borderWidth)
//   .borderColor(style.borderColor)
//   .borderRadius(style.borderRadius)
//   .linearGradient(style.linearGradient)
//   .zIndex(style.zIndex)
//   .opacity(style.opacity)
//   .clip(style.clip)
// }
//


// @Component
// export struct TaroSpan {
//   @ObjectLink node: TaroTextNode | TaroTextElement
//
//   aboutToAppear () {
//     // 绑定动画
//     bindAnimation(this.node as TaroTextElement)
//   }
//
//
//   build() {
//     Span(this.node.textContent)
//       .spanAttrs(getNormalAttributes(this.node as TaroTextElement))
//   }
// }

// TODO: 使用 @Builder 后，嵌套文本无法渲染出来，但如果不使用 Builder，会出现下面注释说的属性更新失效的问题。
// TODO: 应该需要鸿蒙测解决异步更新时，@Builder 的异常问题后才能正常展示和渲染。
// @Builder
// function buildSpan (node: TaroTextNode | TaroTextElement) {
//   // @ObjectLink node 直接传递 node.children[item] 给另一个组件的 @ObjectLink 属性，在更新时子组件的属性会变为 undefined
//   // 中间增加一层  @Builder 可以解决这个奇怪的问题
//   TaroSpan({ node })
// }

@Component
export default struct TaroText {
  nodeInfoMap: TaroAny = {}

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
    .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, res => {
      const eventResult: TaroAny = res.eventResult
      this.nodeInfoMap[this.node._nid].areaInfo = eventResult[1]
    }))
  }


  build() {
    TaroComponentWrapper({ node: this.node }) {
      // if (this.node.childNodes.findIndex(node => isElement(node) && node.tagName === 'TEXT') > -1) {
      //   // Text 嵌套 Text。受 Span 限制，最多嵌套一层
      //   Text() {
      //     ForEach(this.node.childNodes, node => {
      //       buildSpan(node)
      //     }, node => node._nid)
      //   }
      //   .defaultEvent()
      //   .attrs(getAttributes(this.node))
      //   .visibleChangeEvent()
      // } else {
        Text(this.node.textContent)
          .defaultEvent()
          .textStyle(getNormalAttributes(this.node))
          .textAttr(getFontAttributes(this.node))
          .visibleChangeEvent()
      // }
    }
  }
}
