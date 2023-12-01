const TARO_TEMPLATES_f0t0 = `import { createNode } from '../render'
import { FlexManager } from '../utils/FlexManager'
import { TOUCH_EVENT_MAP } from '../utils/constant/event'
import { getNodeThresholds, getNormalAttributes, getTextAttributes } from '../utils/helper'
import { TaroIgnoreElement, eventHandler, DynamicCenter, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME } from '../../runtime'

import type { TaroElement } from '../../runtime'
@Extend(Flex)
function attrs ({
  flexBasis,
  flexGrow,
  flexShrink,
  alignSelf,
  clip,
  width,
  height,
  margin,
  padding,
  linearGradient,
  zIndex,
  borderStyle,
  borderWidth,
  borderColor,
  borderRadius,
  opacity,
  backgroundColor,
  backgroundImage,
  backgroundRepeat,
  backgroundImageSize,
  constraintSize,
  rotate,
  scale,
  translate,
  transform
}) {
  .flexGrow(flexGrow)
  .flexShrink(flexShrink)
  .flexBasis(flexBasis)
  .alignSelf(alignSelf)
  .width(width)
  .height(height)
  .constraintSize(constraintSize)
  .margin(margin)
  .padding(padding)
  .linearGradient(linearGradient)
  .zIndex(zIndex)
  .borderStyle(borderStyle)
  .borderWidth(borderWidth)
  .borderColor(borderColor)
  .borderRadius(borderRadius)
  .opacity(opacity)
  .backgroundColor(backgroundColor)
  .backgroundImage(backgroundImage, backgroundRepeat)
  .backgroundImageSize(backgroundImageSize)
  .rotate(rotate)
  .scale(scale)
  .translate(translate)
  .transform(transform)
  .clip(clip)
}
@Extend(Text)
function attrsText ({
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
@Component
export default struct TARO_TEMPLATES_f0t0 {
  nodeInfoMap: any = {}
  dynamicCenter: DynamicCenter
  @ObjectLink node: TaroElement

  aboutToAppear () {
    this.dynamicCenter = new DynamicCenter()
    this.dynamicCenter.bindComponentToNodeWithDFS(this.node, this)
  }

  @State node0: TaroElement = new TaroIgnoreElement()
  @State node1: TaroElement = new TaroIgnoreElement()
  @State node2: TaroElement = new TaroIgnoreElement()
  @State node3: TaroElement = new TaroIgnoreElement()
  @State node4: TaroElement = new TaroIgnoreElement()
  @State node5: TaroElement = new TaroIgnoreElement()
  @State node6: TaroElement = new TaroIgnoreElement()
  
  build() {
    Flex(FlexManager.flexOptions(this.node0)) {
      Text(this.node0.childNodes[0].textContent)
      .attrsText(getTextAttributes(this.node0.childNodes[0]))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[0]) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[0], VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[0], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
        const [_, areaResult] = eventResult
        this.nodeInfoMap[this.node0.childNodes[0]._nid].areaInfo = areaResult
      }))
      Flex(FlexManager.flexOptions(this.node1)) {
        Text(this.node1.childNodes[0].textContent)
        .attrsText(getTextAttributes(this.node1.childNodes[0]))
        .onVisibleAreaChange(getNodeThresholds(this.node1.childNodes[0]) || [0.0, 1.0], getComponentEventCallback(this.node1.childNodes[0], VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node1.childNodes[0], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
          const [_, areaResult] = eventResult
          this.nodeInfoMap[this.node1.childNodes[0]._nid].areaInfo = areaResult
        }))
      }
      .attrs(getNormalAttributes(this.node1))
      .onVisibleAreaChange(getNodeThresholds(this.node1) || [0.0, 1.0], getComponentEventCallback(this.node1, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node1, AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
        const [_, areaResult] = eventResult
        this.nodeInfoMap[this.node1._nid].areaInfo = areaResult
      }))
      Flex(FlexManager.flexOptions(this.node0.childNodes[2])) {
        Text(this.node0.childNodes[2].childNodes[0].textContent)
        .attrsText(getTextAttributes(this.node0.childNodes[2].childNodes[0]))
        .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[2].childNodes[0]) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[2].childNodes[0], VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node0.childNodes[2].childNodes[0], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
          const [_, areaResult] = eventResult
          this.nodeInfoMap[this.node0.childNodes[2].childNodes[0]._nid].areaInfo = areaResult
        }))
      }
      .attrs(getNormalAttributes(this.node0.childNodes[2]))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[2]) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[2], VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[2], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
        const [_, areaResult] = eventResult
        this.nodeInfoMap[this.node0.childNodes[2]._nid].areaInfo = areaResult
      }))
      Flex(FlexManager.flexOptions(this.node0.childNodes[3])) {
        Flex(FlexManager.flexOptions(this.node2)) {
          Text(this.node2.childNodes[0].textContent)
          .attrsText(getTextAttributes(this.node2.childNodes[0]))
          .onVisibleAreaChange(getNodeThresholds(this.node2.childNodes[0]) || [0.0, 1.0], getComponentEventCallback(this.node2.childNodes[0], VISIBLE_CHANGE_EVENT_NAME))
          .onAreaChange(getComponentEventCallback(this.node2.childNodes[0], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
            const [_, areaResult] = eventResult
            this.nodeInfoMap[this.node2.childNodes[0]._nid].areaInfo = areaResult
          }))
        }
        .attrs(getNormalAttributes(this.node2))
        .onVisibleAreaChange(getNodeThresholds(this.node2) || [0.0, 1.0], getComponentEventCallback(this.node2, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node2, AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
          const [_, areaResult] = eventResult
          this.nodeInfoMap[this.node2._nid].areaInfo = areaResult
        }))
        Flex(FlexManager.flexOptions(this.node0.childNodes[3].childNodes[1])) {
          Text(this.node0.childNodes[3].childNodes[1].childNodes[0].textContent)
          .attrsText(getTextAttributes(this.node0.childNodes[3].childNodes[1].childNodes[0]))
          .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[3].childNodes[1].childNodes[0]) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[3].childNodes[1].childNodes[0], VISIBLE_CHANGE_EVENT_NAME))
          .onAreaChange(getComponentEventCallback(this.node0.childNodes[3].childNodes[1].childNodes[0], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
            const [_, areaResult] = eventResult
            this.nodeInfoMap[this.node0.childNodes[3].childNodes[1].childNodes[0]._nid].areaInfo = areaResult
          }))
        }
        .attrs(getNormalAttributes(this.node0.childNodes[3].childNodes[1]))
        .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[3].childNodes[1]) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[3].childNodes[1], VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node0.childNodes[3].childNodes[1], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
          const [_, areaResult] = eventResult
          this.nodeInfoMap[this.node0.childNodes[3].childNodes[1]._nid].areaInfo = areaResult
        }))
      }
      .attrs(getNormalAttributes(this.node0.childNodes[3]))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[3]) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[3], VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[3], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
        const [_, areaResult] = eventResult
        this.nodeInfoMap[this.node0.childNodes[3]._nid].areaInfo = areaResult
      }))
      Flex(FlexManager.flexOptions(this.node3)) {
        Text(this.node3.childNodes[0].textContent)
        .attrsText(getTextAttributes(this.node3.childNodes[0]))
        .onVisibleAreaChange(getNodeThresholds(this.node3.childNodes[0]) || [0.0, 1.0], getComponentEventCallback(this.node3.childNodes[0], VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node3.childNodes[0], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
          const [_, areaResult] = eventResult
          this.nodeInfoMap[this.node3.childNodes[0]._nid].areaInfo = areaResult
        }))
      }
      .attrs(getNormalAttributes(this.node3))
      .onVisibleAreaChange(getNodeThresholds(this.node3) || [0.0, 1.0], getComponentEventCallback(this.node3, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node3, AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
        const [_, areaResult] = eventResult
        this.nodeInfoMap[this.node3._nid].areaInfo = areaResult
      }))
      Flex(FlexManager.flexOptions(this.node4)) {
        Text(this.node4.childNodes[0].textContent)
        .attrsText(getTextAttributes(this.node4.childNodes[0]))
        .onVisibleAreaChange(getNodeThresholds(this.node4.childNodes[0]) || [0.0, 1.0], getComponentEventCallback(this.node4.childNodes[0], VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node4.childNodes[0], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
          const [_, areaResult] = eventResult
          this.nodeInfoMap[this.node4.childNodes[0]._nid].areaInfo = areaResult
        }))
      }
      .attrs(getNormalAttributes(this.node4))
      .onVisibleAreaChange(getNodeThresholds(this.node4) || [0.0, 1.0], getComponentEventCallback(this.node4, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node4, AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
        const [_, areaResult] = eventResult
        this.nodeInfoMap[this.node4._nid].areaInfo = areaResult
      }))
      Flex(FlexManager.flexOptions(this.node5)) {
        Text(this.node5.childNodes[0].textContent)
        .attrsText(getTextAttributes(this.node5.childNodes[0]))
        .onVisibleAreaChange(getNodeThresholds(this.node5.childNodes[0]) || [0.0, 1.0], getComponentEventCallback(this.node5.childNodes[0], VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node5.childNodes[0], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
          const [_, areaResult] = eventResult
          this.nodeInfoMap[this.node5.childNodes[0]._nid].areaInfo = areaResult
        }))
      }
      .attrs(getNormalAttributes(this.node5))
      .onVisibleAreaChange(getNodeThresholds(this.node5) || [0.0, 1.0], getComponentEventCallback(this.node5, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node5, AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
        const [_, areaResult] = eventResult
        this.nodeInfoMap[this.node5._nid].areaInfo = areaResult
      }))
      Flex(FlexManager.flexOptions(this.node0.childNodes[7])) {
        Text(this.node0.childNodes[7].childNodes[0].textContent)
        .attrsText(getTextAttributes(this.node0.childNodes[7].childNodes[0]))
        .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[7].childNodes[0]) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[7].childNodes[0], VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node0.childNodes[7].childNodes[0], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
          const [_, areaResult] = eventResult
          this.nodeInfoMap[this.node0.childNodes[7].childNodes[0]._nid].areaInfo = areaResult
        }))
      }
      .attrs(getNormalAttributes(this.node0.childNodes[7]))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[7]) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[7], VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[7], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
        const [_, areaResult] = eventResult
        this.nodeInfoMap[this.node0.childNodes[7]._nid].areaInfo = areaResult
      }))
      Flex(FlexManager.flexOptions(this.node0.childNodes[8])) {
        Text(this.node0.childNodes[8].childNodes[0].textContent)
        .attrsText(getTextAttributes(this.node0.childNodes[8].childNodes[0]))
        .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[8].childNodes[0]) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[8].childNodes[0], VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node0.childNodes[8].childNodes[0], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
          const [_, areaResult] = eventResult
          this.nodeInfoMap[this.node0.childNodes[8].childNodes[0]._nid].areaInfo = areaResult
        }))
      }
      .attrs(getNormalAttributes(this.node0.childNodes[8]))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[8]) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[8], VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[8], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
        const [_, areaResult] = eventResult
        this.nodeInfoMap[this.node0.childNodes[8]._nid].areaInfo = areaResult
      }))
      Flex(FlexManager.flexOptions(this.node6)) {
        Text(this.node6.childNodes[0].textContent)
        .attrsText(getTextAttributes(this.node6.childNodes[0]))
        .onVisibleAreaChange(getNodeThresholds(this.node6.childNodes[0]) || [0.0, 1.0], getComponentEventCallback(this.node6.childNodes[0], VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node6.childNodes[0], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
          const [_, areaResult] = eventResult
          this.nodeInfoMap[this.node6.childNodes[0]._nid].areaInfo = areaResult
        }))
      }
      .attrs(getNormalAttributes(this.node6))
      .onVisibleAreaChange(getNodeThresholds(this.node6) || [0.0, 1.0], getComponentEventCallback(this.node6, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node6, AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
        const [_, areaResult] = eventResult
        this.nodeInfoMap[this.node6._nid].areaInfo = areaResult
      }))
    }
    .attrs(getNormalAttributes(this.node0))
    .onVisibleAreaChange(getNodeThresholds(this.node0) || [0.0, 1.0], getComponentEventCallback(this.node0, VISIBLE_CHANGE_EVENT_NAME))
    .onAreaChange(getComponentEventCallback(this.node0, AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
      const [_, areaResult] = eventResult
      this.nodeInfoMap[this.node0._nid].areaInfo = areaResult
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
