const TARO_TEMPLATES_f0t0 = `import { createNode } from '../render'
import { FlexManager } from '../utils/FlexManager'
import { TOUCH_EVENT_MAP } from '../utils/constant/event'
import { getNodeThresholds, getNormalAttributes, getFontAttributes } from '../utils/helper'
import { TaroIgnoreElement, eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME } from '../../runtime'
import { DynamicCenter } from '../utils/DynamicCenter'

import type { TaroViewElement } from '../element'
import type { TaroElement, TaroAny, TaroStyleType, TaroTextStyleType } from '../../runtime'

@Extend(Flex)
function attrs (style: TaroStyleType) {
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
  .backgroundImagePosition(style.backgroundImagePosition)
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
  .backgroundImagePosition(style.backgroundImagePosition)
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
export default struct TARO_TEMPLATES_f0t0 {
  nodeInfoMap: TaroAny = {}
  dynamicCenter: DynamicCenter = new DynamicCenter()
  @ObjectLink node: TaroViewElement

  aboutToAppear () {
    this.dynamicCenter.bindComponentToNodeWithDFS(this.node, this)
  }

  @State node0: TaroElement = new TaroIgnoreElement()
  @State node1: TaroElement = new TaroIgnoreElement()
  @State node2: TaroElement = new TaroIgnoreElement()
  @State node3: TaroElement = new TaroIgnoreElement()
  @State node4: TaroElement = new TaroIgnoreElement()
  
  build() {
    Flex(FlexManager.flexOptions(this.node0 as TaroElement)) {
      if ((this.node0.childNodes[0] as TaroElement)._attrs.compileIf) {
        Flex(FlexManager.flexOptions(this.node1 as TaroElement)) {
          Text(this.node1.childNodes[0].textContent)
          .textStyle(getNormalAttributes(this.node1.childNodes[0] as TaroElement))
          .textAttr(getFontAttributes(this.node1.childNodes[0] as TaroElement))
          .onVisibleAreaChange(getNodeThresholds(this.node1.childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node1.childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
          .onAreaChange(getComponentEventCallback(this.node1.childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, res => {
            const eventResult: TaroAny = res.eventResult
            this.nodeInfoMap[this.node1.childNodes[0]._nid].areaInfo = eventResult[1]
          }))
        }
        .attrs(getNormalAttributes(this.node1 as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(this.node1 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node1 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node1 as TaroElement, AREA_CHANGE_EVENT_NAME, res => {
          const eventResult: TaroAny = res.eventResult
          this.nodeInfoMap[this.node1._nid].areaInfo = eventResult[1]
        }))
      }
      if ((this.node0.childNodes[1] as TaroElement)._attrs.compileIf) {
        Flex(FlexManager.flexOptions(this.node2 as TaroElement)) {
          Text(this.node2.childNodes[0].textContent)
          .textStyle(getNormalAttributes(this.node2.childNodes[0] as TaroElement))
          .textAttr(getFontAttributes(this.node2.childNodes[0] as TaroElement))
          .onVisibleAreaChange(getNodeThresholds(this.node2.childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node2.childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
          .onAreaChange(getComponentEventCallback(this.node2.childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, res => {
            const eventResult: TaroAny = res.eventResult
            this.nodeInfoMap[this.node2.childNodes[0]._nid].areaInfo = eventResult[1]
          }))
        }
        .attrs(getNormalAttributes(this.node2 as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(this.node2 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node2 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node2 as TaroElement, AREA_CHANGE_EVENT_NAME, res => {
          const eventResult: TaroAny = res.eventResult
          this.nodeInfoMap[this.node2._nid].areaInfo = eventResult[1]
        }))
      }
      if ((this.node0.childNodes[2] as TaroElement)._attrs.compileIf) {
        Flex(FlexManager.flexOptions(this.node3 as TaroElement)) {
          Text(this.node3.childNodes[0].textContent)
          .textStyle(getNormalAttributes(this.node3.childNodes[0] as TaroElement))
          .textAttr(getFontAttributes(this.node3.childNodes[0] as TaroElement))
          .onVisibleAreaChange(getNodeThresholds(this.node3.childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node3.childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
          .onAreaChange(getComponentEventCallback(this.node3.childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, res => {
            const eventResult: TaroAny = res.eventResult
            this.nodeInfoMap[this.node3.childNodes[0]._nid].areaInfo = eventResult[1]
          }))
        }
        .attrs(getNormalAttributes(this.node3 as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(this.node3 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node3 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node3 as TaroElement, AREA_CHANGE_EVENT_NAME, res => {
          const eventResult: TaroAny = res.eventResult
          this.nodeInfoMap[this.node3._nid].areaInfo = eventResult[1]
        }))
      }
      if ((this.node0.childNodes[3] as TaroElement)._attrs.compileIf) {
        Text(this.node0.childNodes[3].textContent)
        .textStyle(getNormalAttributes(this.node0.childNodes[3] as TaroElement))
        .textAttr(getFontAttributes(this.node0.childNodes[3] as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[3] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[3] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node0.childNodes[3] as TaroElement, AREA_CHANGE_EVENT_NAME, res => {
          const eventResult: TaroAny = res.eventResult
          this.nodeInfoMap[this.node0.childNodes[3]._nid].areaInfo = eventResult[1]
        }))
      } else {
        Text(this.node0.childNodes[3].textContent)
        .textStyle(getNormalAttributes(this.node0.childNodes[3] as TaroElement))
        .textAttr(getFontAttributes(this.node0.childNodes[3] as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[3] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[3] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node0.childNodes[3] as TaroElement, AREA_CHANGE_EVENT_NAME, res => {
          const eventResult: TaroAny = res.eventResult
          this.nodeInfoMap[this.node0.childNodes[3]._nid].areaInfo = eventResult[1]
        }))
      }
      Flex(FlexManager.flexOptions(this.node4 as TaroElement)) {}
      .attrs(getNormalAttributes(this.node4 as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node4 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node4 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node4 as TaroElement, AREA_CHANGE_EVENT_NAME, res => {
        const eventResult: TaroAny = res.eventResult
        this.nodeInfoMap[this.node4._nid].areaInfo = eventResult[1]
      }))
    }
    .attrs(getNormalAttributes(this.node0 as TaroElement))
    .onVisibleAreaChange(getNodeThresholds(this.node0 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
    .onAreaChange(getComponentEventCallback(this.node0 as TaroElement, AREA_CHANGE_EVENT_NAME, res => {
      const eventResult: TaroAny = res.eventResult
      this.nodeInfoMap[this.node0._nid].areaInfo = eventResult[1]
    }))
  }
}
`;
function Index() {
    return <View compileMode="f0t0" _dynamicID="node0">

            {condition ? <View hoverClass={myClass} compileIf={condition} _dynamicID="node1">{content}</View> : <View compileIgnore/>}

            {condition ? <View hoverClass={myClass} compileIf={condition} _dynamicID="node2">{content}</View> : <View compileIgnore/>}

            {condition1 && "condition2" && condition3 ? <View hoverClass={myClass} compileIf={condition1 && "condition2" && condition3} _dynamicID="node3">{content}</View> : <View compileIgnore/>}

            {condition1 ? 'Hello' : ""}

            <View hoverClass={myClass} _dynamicID="node4"></View>

          </View>;
}
