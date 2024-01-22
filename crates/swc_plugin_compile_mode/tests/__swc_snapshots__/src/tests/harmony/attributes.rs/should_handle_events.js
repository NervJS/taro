const TARO_TEMPLATES_f0t0 = `import { createLazyChildren, createChildItem } from '../render'
import commonStyleModify from '../style'
import { getButtonColor } from '../button'
import { FlexManager } from '../utils/FlexManager'
import { TOUCH_EVENT_MAP } from '../utils/constant/event'
import { BUTTON_THEME_COLOR } from '../utils/constant/style'
import { getNodeThresholds, getNormalAttributes, getFontAttributes } from '../utils/helper'
import { NodeType, convertNumber2VP, TaroElement, eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME } from '../../runtime'
import { DynamicCenter } from '../utils/DynamicCenter'

import type { TaroButtonElement, TaroViewElement, TaroAny, TaroStyleType, TaroTextStyleType } from '../../runtime'

@Extend(Row)
function rowAttrs (style: TaroStyleType) {
  .constraintSize({
    minWidth: style.minWidth || style.width,
    maxWidth: style.maxWidth,
    minHeight: style.minHeight,
    maxHeight: style.maxHeight
  })
}
@Extend(Column)
function columnAttrs (style: TaroStyleType) {
  .constraintSize({
    minWidth: style.minWidth,
    maxWidth: style.maxWidth,
    minHeight: style.minHeight || style.height,
    maxHeight: style.maxHeight
  })
}
function getImageMode (mode: string): ImageFit {
  switch (mode) {
    case 'aspectFit': return ImageFit.Contain
    case 'aspectFill': return ImageFit.Cover
    case 'scaleToFill': return ImageFit.Fill
    case 'widthFix': return ImageFit.Auto
    case 'heightFix': return ImageFit.Auto
    default: return ImageFit.Contain
  }
}
@Component
export default struct TARO_TEMPLATES_f0t0 {
  node: TaroViewElement = new TaroElement('Ignore')

  dynamicCenter: DynamicCenter = new DynamicCenter()

  aboutToAppear () {
    this.dynamicCenter.bindComponentToNodeWithDFS(this.node, this)
  }

  @State node0: TaroElement = new TaroElement('Ignore')
  @State node1: TaroElement = new TaroElement('Ignore')
  @State node2: TaroElement = new TaroElement('Ignore')
  
  build() {
    Column() {
      Column() {}
      .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[0] as TaroElement))
      .columnAttrs(getNormalAttributes(this.node0.childNodes[0] as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node0.childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      .alignItems(FlexManager.flexOptions(this.node0.childNodes[0] as TaroElement).alignItems as HorizontalAlign)
      .justifyContent(FlexManager.flexOptions(this.node0.childNodes[0] as TaroElement).justifyContent)
      .onClick(e => eventHandler(e, 'click', this.node0.childNodes[0] as TaroElement))
      Column() {}
      .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[1] as TaroElement))
      .columnAttrs(getNormalAttributes(this.node0.childNodes[1] as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[1] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[1] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[1] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node0.childNodes[1] as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      .alignItems(FlexManager.flexOptions(this.node0.childNodes[1] as TaroElement).alignItems as HorizontalAlign)
      .justifyContent(FlexManager.flexOptions(this.node0.childNodes[1] as TaroElement).justifyContent)
      .onClick(e => eventHandler(e, 'click', this.node0.childNodes[1] as TaroElement))
      Column() {}
      .attributeModifier(commonStyleModify.setNode(this.node1 as TaroElement))
      .columnAttrs(getNormalAttributes(this.node1 as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node1 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node1 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node1 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node1 as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      .alignItems(FlexManager.flexOptions(this.node1 as TaroElement).alignItems as HorizontalAlign)
      .justifyContent(FlexManager.flexOptions(this.node1 as TaroElement).justifyContent)
      .onClick(e => eventHandler(e, 'click', this.node1 as TaroElement))
      Column() {}
      .attributeModifier(commonStyleModify.setNode(this.node2 as TaroElement))
      .columnAttrs(getNormalAttributes(this.node2 as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node2 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node2 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node2 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node2 as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      .alignItems(FlexManager.flexOptions(this.node2 as TaroElement).alignItems as HorizontalAlign)
      .justifyContent(FlexManager.flexOptions(this.node2 as TaroElement).justifyContent)
      Image((this.node0.childNodes[4] as TaroElement).getAttribute('src'))
      .objectFit(getImageMode((this.node0.childNodes[4] as TaroElement).getAttribute('mode')))
      .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[4] as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[4] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[4] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[4] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node0.childNodes[4] as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      .onComplete(e => eventHandler(e, 'complete', this.node0.childNodes[4] as TaroElement))
      Column() {}
      .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[5] as TaroElement))
      .columnAttrs(getNormalAttributes(this.node0.childNodes[5] as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[5] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[5] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[5] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node0.childNodes[5] as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      .alignItems(FlexManager.flexOptions(this.node0.childNodes[5] as TaroElement).alignItems as HorizontalAlign)
      .justifyContent(FlexManager.flexOptions(this.node0.childNodes[5] as TaroElement).justifyContent)
      .onClick(e => eventHandler(e, 'click', this.node0.childNodes[5] as TaroElement))
      .onTouch(e => eventHandler(e, TOUCH_EVENT_MAP.get(e.type), this.node0.childNodes[5] as TaroElement))
    }
    .attributeModifier(commonStyleModify.setNode(this.node0 as TaroElement))
    .columnAttrs(getNormalAttributes(this.node0 as TaroElement))
    .onVisibleAreaChange(getNodeThresholds(this.node0 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
    .onAreaChange(getComponentEventCallback(this.node0 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      (this.node0 as TaroElement)._nodeInfo.areaInfo = res[1]
    }))
    .alignItems(FlexManager.flexOptions(this.node0 as TaroElement).alignItems as HorizontalAlign)
    .justifyContent(FlexManager.flexOptions(this.node0 as TaroElement).justifyContent)
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
