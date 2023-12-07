import { bindInstanceToNode, eventHandler, convertNumber2VP, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, initComponentNodeInfo, TaroAny } from '@tarojs/runtime'

import TaroComponentWrapper from './base'
import { ICON_SVG_MAP } from './utils/constant/icon'
import { getNormalAttributes, shouldBindEvent, getNodeThresholds, bindAnimation } from './utils/helper'

import type { TaroIconElement } from './element'
import type { TaroStyleType } from './type'


@Extend(Image)
function attrs (style: TaroStyleType) {
  .id(style.id)
  .key(style.id)
  .padding(style.padding)
  .margin(style.margin)
  .width(style.width || convertNumber2VP(23))
  .height(style.height || convertNumber2VP(23))
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
}

@Component
export default struct TaroIcon {
  nodeInfoMap: TaroAny = {}

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  @ObjectLink node: TaroIconElement

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

  getIconData () {
    if (!this.node || !this.node._attrs) return null
    const type: string = this.node._attrs.type
    // TODO：等待鸿蒙支持 base64 格式的 svg 图片，或者工程化支持图片资源的迁移
    return ICON_SVG_MAP.get(type) || null
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      Image(this.getIconData())
        .defaultEvent()
        .objectFit(ImageFit.Contain)
        .fillColor(this.node._attrs.color)
        .onComplete(e => eventHandler(e, 'complete', this.node))
        .attrs(getNormalAttributes(this.node))
        .visibleChangeEvent()
    }
  }
}
