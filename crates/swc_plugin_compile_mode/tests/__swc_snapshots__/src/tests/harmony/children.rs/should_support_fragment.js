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
  node: TaroViewElement = new TaroElement('Ignore')

  dynamicCenter: DynamicCenter = new DynamicCenter()

  aboutToAppear () {
    this.dynamicCenter.bindComponentToNodeWithDFS(this.node, this)
  }

  @State node0: TaroElement = new TaroElement('Ignore')
  @State node1: TaroElement = new TaroElement('Ignore')
  @State node2: TaroElement = new TaroElement('Ignore')
  @State node3: TaroElement = new TaroElement('Ignore')
  @State node4: TaroElement = new TaroElement('Ignore')
  @State node5: TaroElement = new TaroElement('Ignore')
  @State node6: TaroElement = new TaroElement('Ignore')
  
  build() {
    Flex(FlexManager.flexOptions(this.node0 as TaroElement)) {
      Text(this.node0.childNodes[0].textContent)
      .textStyle(getNormalAttributes(this.node0.childNodes[0] as TaroElement))
      .textAttr(getFontAttributes(this.node0.childNodes[0] as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node0.childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      Flex(FlexManager.flexOptions(this.node1 as TaroElement)) {
        Text(this.node1.childNodes[0].textContent)
        .textStyle(getNormalAttributes(this.node1.childNodes[0] as TaroElement))
        .textAttr(getFontAttributes(this.node1.childNodes[0] as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(this.node1.childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node1.childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node1.childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          (this.node1.childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
        }))
      }
      .attrs(getNormalAttributes(this.node1 as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node1 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node1 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node1 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node1 as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      Flex(FlexManager.flexOptions(this.node0.childNodes[2] as TaroElement)) {
        Text(this.node0.childNodes[2].childNodes[0].textContent)
        .textStyle(getNormalAttributes(this.node0.childNodes[2].childNodes[0] as TaroElement))
        .textAttr(getFontAttributes(this.node0.childNodes[2].childNodes[0] as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[2].childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[2].childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node0.childNodes[2].childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          (this.node0.childNodes[2].childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
        }))
      }
      .attrs(getNormalAttributes(this.node0.childNodes[2] as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[2] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[2] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[2] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node0.childNodes[2] as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      Flex(FlexManager.flexOptions(this.node0.childNodes[3] as TaroElement)) {
        Flex(FlexManager.flexOptions(this.node2 as TaroElement)) {
          Text(this.node2.childNodes[0].textContent)
          .textStyle(getNormalAttributes(this.node2.childNodes[0] as TaroElement))
          .textAttr(getFontAttributes(this.node2.childNodes[0] as TaroElement))
          .onVisibleAreaChange(getNodeThresholds(this.node2.childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node2.childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
          .onAreaChange(getComponentEventCallback(this.node2.childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
            (this.node2.childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
          }))
        }
        .attrs(getNormalAttributes(this.node2 as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(this.node2 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node2 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node2 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          (this.node2 as TaroElement)._nodeInfo.areaInfo = res[1]
        }))
        Flex(FlexManager.flexOptions(this.node0.childNodes[3].childNodes[1] as TaroElement)) {
          Text(this.node0.childNodes[3].childNodes[1].childNodes[0].textContent)
          .textStyle(getNormalAttributes(this.node0.childNodes[3].childNodes[1].childNodes[0] as TaroElement))
          .textAttr(getFontAttributes(this.node0.childNodes[3].childNodes[1].childNodes[0] as TaroElement))
          .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[3].childNodes[1].childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[3].childNodes[1].childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
          .onAreaChange(getComponentEventCallback(this.node0.childNodes[3].childNodes[1].childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
            (this.node0.childNodes[3].childNodes[1].childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
          }))
        }
        .attrs(getNormalAttributes(this.node0.childNodes[3].childNodes[1] as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[3].childNodes[1] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[3].childNodes[1] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node0.childNodes[3].childNodes[1] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          (this.node0.childNodes[3].childNodes[1] as TaroElement)._nodeInfo.areaInfo = res[1]
        }))
      }
      .attrs(getNormalAttributes(this.node0.childNodes[3] as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[3] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[3] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[3] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node0.childNodes[3] as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      Flex(FlexManager.flexOptions(this.node3 as TaroElement)) {
        Text(this.node3.childNodes[0].textContent)
        .textStyle(getNormalAttributes(this.node3.childNodes[0] as TaroElement))
        .textAttr(getFontAttributes(this.node3.childNodes[0] as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(this.node3.childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node3.childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node3.childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          (this.node3.childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
        }))
      }
      .attrs(getNormalAttributes(this.node3 as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node3 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node3 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node3 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node3 as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      Flex(FlexManager.flexOptions(this.node4 as TaroElement)) {
        Text(this.node4.childNodes[0].textContent)
        .textStyle(getNormalAttributes(this.node4.childNodes[0] as TaroElement))
        .textAttr(getFontAttributes(this.node4.childNodes[0] as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(this.node4.childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node4.childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node4.childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          (this.node4.childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
        }))
      }
      .attrs(getNormalAttributes(this.node4 as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node4 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node4 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node4 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node4 as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      Flex(FlexManager.flexOptions(this.node5 as TaroElement)) {
        Text(this.node5.childNodes[0].textContent)
        .textStyle(getNormalAttributes(this.node5.childNodes[0] as TaroElement))
        .textAttr(getFontAttributes(this.node5.childNodes[0] as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(this.node5.childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node5.childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node5.childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          (this.node5.childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
        }))
      }
      .attrs(getNormalAttributes(this.node5 as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node5 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node5 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node5 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node5 as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      Flex(FlexManager.flexOptions(this.node0.childNodes[7] as TaroElement)) {
        Text(this.node0.childNodes[7].childNodes[0].textContent)
        .textStyle(getNormalAttributes(this.node0.childNodes[7].childNodes[0] as TaroElement))
        .textAttr(getFontAttributes(this.node0.childNodes[7].childNodes[0] as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[7].childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[7].childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node0.childNodes[7].childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          (this.node0.childNodes[7].childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
        }))
      }
      .attrs(getNormalAttributes(this.node0.childNodes[7] as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[7] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[7] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[7] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node0.childNodes[7] as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      Flex(FlexManager.flexOptions(this.node0.childNodes[8] as TaroElement)) {
        Text(this.node0.childNodes[8].childNodes[0].textContent)
        .textStyle(getNormalAttributes(this.node0.childNodes[8].childNodes[0] as TaroElement))
        .textAttr(getFontAttributes(this.node0.childNodes[8].childNodes[0] as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[8].childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[8].childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node0.childNodes[8].childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          (this.node0.childNodes[8].childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
        }))
      }
      .attrs(getNormalAttributes(this.node0.childNodes[8] as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[8] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[8] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[8] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node0.childNodes[8] as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      Flex(FlexManager.flexOptions(this.node6 as TaroElement)) {
        Text(this.node6.childNodes[0].textContent)
        .textStyle(getNormalAttributes(this.node6.childNodes[0] as TaroElement))
        .textAttr(getFontAttributes(this.node6.childNodes[0] as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(this.node6.childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node6.childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node6.childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          (this.node6.childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
        }))
      }
      .attrs(getNormalAttributes(this.node6 as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node6 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node6 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node6 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node6 as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
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

            {content0}

            <>

              <View _dynamicID="node1">{content1}</View>

              <View>hello</View>

              <View>

                <>

                  <View _dynamicID="node2">{content2}</View>

                  <View>hello!</View>

                </>

              </View>

              <View _dynamicID="node3">{content3}</View>

            </>

            <View _dynamicID="node4">{content4}</View>

            <>

              <View _dynamicID="node5">{content5}</View>

            </>

            <>

              <View>hello!!</View>

            </>

            <View>hello!!!</View>

            <View _dynamicID="node6">{content6}</View>

          </View>;
}
