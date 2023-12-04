const TARO_TEMPLATES_f0t0 = `import { createNode } from '../render'
import { FlexManager } from '../utils/FlexManager'
import { TOUCH_EVENT_MAP } from '../utils/constant/event'
import { getNodeThresholds, getNormalAttributes, getFontAttributes } from '../utils/helper'
import { TaroIgnoreElement, eventHandler, DynamicCenter, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME } from '../../runtime'

import type { TaroViewElement } from '../element'
import type { TaroElement } from '../../runtime'
import type { TaroStyleType, CompType } from '../type'
import type { TaroAny } from '../utils/type'

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
@Extend(Image)
function attrsImage (style: TaroStyleType) {
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
  
  build() {
    Flex(FlexManager.flexOptions(this.node0 as TaroElement)) {
      Flex(FlexManager.flexOptions(this.node0.childNodes[0] as TaroElement)) {}
      .attrs(getNormalAttributes(this.node0.childNodes[0] as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, res => {
        const eventResult: TaroAny = res.eventResult
        this.nodeInfoMap[this.node0.childNodes[0]._nid].areaInfo = eventResult[1]
      }))
      .onClick(e => eventHandler(e, 'click', this.node0.childNodes[0] as TaroElement))
      Flex(FlexManager.flexOptions(this.node0.childNodes[1] as TaroElement)) {}
      .attrs(getNormalAttributes(this.node0.childNodes[1] as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[1] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[1] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[1] as TaroElement, AREA_CHANGE_EVENT_NAME, res => {
        const eventResult: TaroAny = res.eventResult
        this.nodeInfoMap[this.node0.childNodes[1]._nid].areaInfo = eventResult[1]
      }))
      .onClick(e => eventHandler(e, 'click', this.node0.childNodes[1] as TaroElement))
      Flex(FlexManager.flexOptions(this.node1 as TaroElement)) {}
      .attrs(getNormalAttributes(this.node1 as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node1 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node1 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node1 as TaroElement, AREA_CHANGE_EVENT_NAME, res => {
        const eventResult: TaroAny = res.eventResult
        this.nodeInfoMap[this.node1._nid].areaInfo = eventResult[1]
      }))
      .onClick(e => eventHandler(e, 'click', this.node1 as TaroElement))
      Flex(FlexManager.flexOptions(this.node2 as TaroElement)) {}
      .attrs(getNormalAttributes(this.node2 as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node2 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node2 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node2 as TaroElement, AREA_CHANGE_EVENT_NAME, res => {
        const eventResult: TaroAny = res.eventResult
        this.nodeInfoMap[this.node2._nid].areaInfo = eventResult[1]
      }))
      Image((this.node0.childNodes[4] as TaroElement).getAttribute('src'))
      .attrsImage(getNormalAttributes(this.node0.childNodes[4] as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[4] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[4] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[4] as TaroElement, AREA_CHANGE_EVENT_NAME, res => {
        const eventResult: TaroAny = res.eventResult
        this.nodeInfoMap[this.node0.childNodes[4]._nid].areaInfo = eventResult[1]
      }))
      .onComplete(e => eventHandler(e, 'complete', this.node0.childNodes[4] as TaroElement))
      Flex(FlexManager.flexOptions(this.node0.childNodes[5] as TaroElement)) {}
      .attrs(getNormalAttributes(this.node0.childNodes[5] as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[5] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[5] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[5] as TaroElement, AREA_CHANGE_EVENT_NAME, res => {
        const eventResult: TaroAny = res.eventResult
        this.nodeInfoMap[this.node0.childNodes[5]._nid].areaInfo = eventResult[1]
      }))
      .onClick(e => eventHandler(e, 'click', this.node0.childNodes[5] as TaroElement))
      .onTouch(e => eventHandler(e, TOUCH_EVENT_MAP[e.type], this.node0.childNodes[5] as TaroElement))
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

            <View onClick={()=>{
        console.log("click done");
    }}></View>

            <View onClick={function clickFn() {
        console.log("click done");
    }}></View>

            <View onClick={handleViewClick} _dynamicID="node1"></View>

            <View onAnimationStart={()=>{}} id={myId} _dynamicID="node2"></View>

            <Image onLoad={()=>{
        console.log("load done");
    }} id="myImg"/>

            <View onClick={()=>{
        console.log("click done");
    }} onTouchStart={()=>{
        console.log("touch start done");
    }}/>

          </View>;
}
