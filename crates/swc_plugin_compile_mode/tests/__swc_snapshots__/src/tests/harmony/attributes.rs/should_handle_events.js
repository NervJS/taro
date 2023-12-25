const TARO_TEMPLATES_f0t0 = `import { createLazyChildren, createChildItem } from '../render'
import { FlexManager } from '../utils/FlexManager'
import { TOUCH_EVENT_MAP } from '../utils/constant/event'
import { getNodeThresholds, getNormalAttributes, getFontAttributes } from '../utils/helper'
import { TaroElement, eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME } from '../../runtime'
import { DynamicCenter } from '../utils/DynamicCenter'

import type { TaroViewElement, TaroAny, TaroStyleType, TaroTextStyleType } from '../../runtime'

@Extend(Flex)
function attrs (style: TaroStyleType) {
  .id(style.id)
  .key(style.id)
  .flexGrow(style.flexGrow)
  .flexShrink(style.flexShrink)
  .flexBasis(style.flexBasis)
  .alignSelf(style.alignSelf)
  .padding({
    top: style.paddingTop,
    right: style.paddingRight,
    bottom: style.paddingBottom,
    left: style.paddingLeft
  })
  .margin({
    top: style.marginTop,
    right: style.marginRight,
    bottom: style.marginBottom,
    left: style.marginLeft
  })
  .width(style.width)
  .height(style.height)
  .constraintSize({
    minWidth: style.minWidth,
    maxWidth: style.maxWidth,
    minHeight: style.minHeight,
    maxHeight: style.maxHeight
  })
  .backgroundColor(style.backgroundColor)
  .backgroundImage(style.backgroundImage?.src, style.backgroundRepeat)
  .backgroundImageSize(style.backgroundSize)
  .backgroundImagePosition(style.backgroundPosition)
  .borderStyle({
    top: style.borderTopStyle,
    right: style.borderRightStyle,
    bottom: style.borderBottomStyle,
    left: style.borderLeftStyle
  })
  .borderWidth({
    top: style.borderTopWidth,
    right: style.borderRightWidth,
    bottom: style.borderBottomWidth,
    left: style.borderLeftWidth
  })
  .borderColor({
    top: style.borderTopColor,
    right: style.borderRightColor,
    bottom: style.borderBottomColor,
    left: style.borderLeftColor
  })
  .borderRadius({
    topLeft: style.borderTopLeftRadius,
    topRight: style.borderTopRightRadius,
    bottomLeft: style.borderBottomLeftRadius,
    bottomRight: style.borderBottomRightRadius
  })
  .zIndex(style.zIndex)
  .opacity(style.opacity)
  .linearGradient(style.linearGradient)
  .clip(style.overflow)
  .rotate({ centerX: style.transformOrigin?.x, centerY: style.transformOrigin?.y, angle: 0 })
  .scale({ centerX: style.transformOrigin?.x, centerY: style.transformOrigin?.y })
  .transform(style.transform)
}
@Extend(Image)
function attrsImage (style: TaroStyleType) {
  .id(style.id)
  .key(style.id)
  .flexGrow(style.flexGrow)
  .flexShrink(style.flexShrink)
  .flexBasis(style.flexBasis)
  .alignSelf(style.alignSelf)
  .padding({
    top: style.paddingTop,
    right: style.paddingRight,
    bottom: style.paddingBottom,
    left: style.paddingLeft
  })
  .margin({
    top: style.marginTop,
    right: style.marginRight,
    bottom: style.marginBottom,
    left: style.marginLeft
  })
  .width(style.width)
  .height(style.height)
  .constraintSize({
    minWidth: style.minWidth,
    maxWidth: style.maxWidth,
    minHeight: style.minHeight,
    maxHeight: style.maxHeight
  })
  .backgroundColor(style.backgroundColor)
  .backgroundImage(style.backgroundImage?.src, style.backgroundRepeat)
  .backgroundImageSize(style.backgroundSize)
  .backgroundImagePosition(style.backgroundPosition)
  .borderStyle({
    top: style.borderTopStyle,
    right: style.borderRightStyle,
    bottom: style.borderBottomStyle,
    left: style.borderLeftStyle
  })
  .borderWidth({
    top: style.borderTopWidth,
    right: style.borderRightWidth,
    bottom: style.borderBottomWidth,
    left: style.borderLeftWidth
  })
  .borderColor({
    top: style.borderTopColor,
    right: style.borderRightColor,
    bottom: style.borderBottomColor,
    left: style.borderLeftColor
  })
  .borderRadius({
    topLeft: style.borderTopLeftRadius,
    topRight: style.borderTopRightRadius,
    bottomLeft: style.borderBottomLeftRadius,
    bottomRight: style.borderBottomRightRadius
  })
  .zIndex(style.zIndex)
  .opacity(style.opacity)
  .linearGradient(style.linearGradient)
  .clip(style.overflow)
  .rotate({ centerX: style.transformOrigin?.x, centerY: style.transformOrigin?.y, angle: 0 })
  .scale({ centerX: style.transformOrigin?.x, centerY: style.transformOrigin?.y })
  .transform(style.transform)
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
    Flex(FlexManager.flexOptions(this.node0 as TaroElement)) {
      Flex(FlexManager.flexOptions(this.node0.childNodes[0] as TaroElement)) {}
      .attrs(getNormalAttributes(this.node0.childNodes[0] as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node0.childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      .onClick(e => eventHandler(e, 'click', this.node0.childNodes[0] as TaroElement))
      Flex(FlexManager.flexOptions(this.node0.childNodes[1] as TaroElement)) {}
      .attrs(getNormalAttributes(this.node0.childNodes[1] as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[1] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[1] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[1] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node0.childNodes[1] as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      .onClick(e => eventHandler(e, 'click', this.node0.childNodes[1] as TaroElement))
      Flex(FlexManager.flexOptions(this.node1 as TaroElement)) {}
      .attrs(getNormalAttributes(this.node1 as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node1 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node1 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node1 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node1 as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      .onClick(e => eventHandler(e, 'click', this.node1 as TaroElement))
      Flex(FlexManager.flexOptions(this.node2 as TaroElement)) {}
      .attrs(getNormalAttributes(this.node2 as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node2 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node2 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node2 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node2 as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      Image((this.node0.childNodes[4] as TaroElement).getAttribute('src'))
      .objectFit(getImageMode((this.node0.childNodes[4] as TaroElement).getAttribute('mode')))
      .attrsImage(getNormalAttributes(this.node0.childNodes[4] as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[4] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[4] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[4] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node0.childNodes[4] as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      .onComplete(e => eventHandler(e, 'complete', this.node0.childNodes[4] as TaroElement))
      Flex(FlexManager.flexOptions(this.node0.childNodes[5] as TaroElement)) {}
      .attrs(getNormalAttributes(this.node0.childNodes[5] as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[5] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[5] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[5] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node0.childNodes[5] as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      .onClick(e => eventHandler(e, 'click', this.node0.childNodes[5] as TaroElement))
      .onTouch(e => eventHandler(e, TOUCH_EVENT_MAP.get(e.type), this.node0.childNodes[5] as TaroElement))
    }
    .attrs(getNormalAttributes(this.node0 as TaroElement))
    .onVisibleAreaChange(getNodeThresholds(this.node0 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
    .onAreaChange(getComponentEventCallback(this.node0 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      (this.node0 as TaroElement)._nodeInfo.areaInfo = res[1]
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
