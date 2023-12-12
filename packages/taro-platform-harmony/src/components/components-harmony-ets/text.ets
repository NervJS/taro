import { bindInstanceToNode, eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, initComponentNodeInfo, TaroAny, NodeType } from '@tarojs/runtime'

import TaroComponentWrapper from './base'
import { getNodeThresholds, getNormalAttributes, getFontAttributes, shouldBindEvent, bindAnimation } from './utils/helper'

import type { TaroTextElement } from './element'
import type { TaroStyleType, TaroTextStyleType } from '@tarojs/runtime'

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
function textAttr(attr: TaroTextStyleType) {
  .textAlign(attr.textAlign)
  .textOverflow(attr.textOverflow)
  .maxLines(attr.maxLines)
  .letterSpacing(attr.letterSpacing)
}


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
      if (this.node.nodeType === NodeType.TEXT_NODE) {
        Text(this.node.textContent)
      } else {
        Text(this.node.textContent)
          .defaultEvent()
          .textStyle(getNormalAttributes(this.node))
          .textAttr(getFontAttributes(this.node))
          .visibleChangeEvent()
      }
    }
  }
}
