const TARO_TEMPLATES_f0t0 = `import { FlexManager } from './utils/FlexManager'
import { getNodeThresholds, getNormalAttributes, getTextAttributes } from './utils/helper'
import { TaroIgnoreElement, eventHandler, DynamicCenter, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME } from '../runtime'
import type { TaroElement } from '../runtime'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
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

function getTextAttributes (node: TaroViewElement) {
  const attrs = {
    ...getNormalAttributes(node),
    ...getFontAttributes(node)
  }

  transformW3CToHarmonyInStyle(node._st, attrs)

  return attrs
}
@Component
struct TARO_TEMPLATES_f0t0 {
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
  @State node7: TaroElement = new TaroIgnoreElement()
  @State node8: TaroElement = new TaroIgnoreElement()
  @State node9: TaroElement = new TaroIgnoreElement()
  @State node10: TaroElement = new TaroIgnoreElement()
  @State node11: TaroElement = new TaroIgnoreElement()
  @State node12: TaroElement = new TaroIgnoreElement()
  @State node13: TaroElement = new TaroIgnoreElement()
  
  build() {
    Flex(FlexManager.flexOptions(this.node0)) {
      if (this.node0.childNodes[0]._attrs.compileIf) {
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
      } else {
        Text(this.node0.childNodes[0].textContent)
        .attrsText(getTextAttributes(this.node0.childNodes[0]))
        .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[0]) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[0], VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node0.childNodes[0], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
          const [_, areaResult] = eventResult
          this.nodeInfoMap[this.node0.childNodes[0]._nid].areaInfo = areaResult
        }))
      }
      if (this.node0.childNodes[1]._attrs.compileIf) {
        if (this.node0.childNodes[1]._attrs.compileIf) {
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
        } else {
          Text(this.node3.textContent)
          .attrsText(getTextAttributes(this.node3))
          .onVisibleAreaChange(getNodeThresholds(this.node3) || [0.0, 1.0], getComponentEventCallback(this.node3, VISIBLE_CHANGE_EVENT_NAME))
          .onAreaChange(getComponentEventCallback(this.node3, AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
            const [_, areaResult] = eventResult
            this.nodeInfoMap[this.node3._nid].areaInfo = areaResult
          }))
        }
      } else {
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
      }
      if (this.node0.childNodes[2]._attrs.compileIf) {
        Flex(FlexManager.flexOptions(this.node7)) {
          Text(this.node7.childNodes[0].textContent)
          .attrsText(getTextAttributes(this.node7.childNodes[0]))
          .onVisibleAreaChange(getNodeThresholds(this.node7.childNodes[0]) || [0.0, 1.0], getComponentEventCallback(this.node7.childNodes[0], VISIBLE_CHANGE_EVENT_NAME))
          .onAreaChange(getComponentEventCallback(this.node7.childNodes[0], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
            const [_, areaResult] = eventResult
            this.nodeInfoMap[this.node7.childNodes[0]._nid].areaInfo = areaResult
          }))
        }
        .attrs(getNormalAttributes(this.node7))
        .onVisibleAreaChange(getNodeThresholds(this.node7) || [0.0, 1.0], getComponentEventCallback(this.node7, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node7, AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
          const [_, areaResult] = eventResult
          this.nodeInfoMap[this.node7._nid].areaInfo = areaResult
        }))
      } else {
        if (this.node0.childNodes[2]._attrs.compileIf) {
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
        } else {
          Text(this.node5.textContent)
          .attrsText(getTextAttributes(this.node5))
          .onVisibleAreaChange(getNodeThresholds(this.node5) || [0.0, 1.0], getComponentEventCallback(this.node5, VISIBLE_CHANGE_EVENT_NAME))
          .onAreaChange(getComponentEventCallback(this.node5, AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
            const [_, areaResult] = eventResult
            this.nodeInfoMap[this.node5._nid].areaInfo = areaResult
          }))
        }
      }
      if (this.node0.childNodes[3]._attrs.compileIf) {
        Flex(FlexManager.flexOptions(this.node8)) {
          Text(this.node8.childNodes[0].textContent)
          .attrsText(getTextAttributes(this.node8.childNodes[0]))
          .onVisibleAreaChange(getNodeThresholds(this.node8.childNodes[0]) || [0.0, 1.0], getComponentEventCallback(this.node8.childNodes[0], VISIBLE_CHANGE_EVENT_NAME))
          .onAreaChange(getComponentEventCallback(this.node8.childNodes[0], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
            const [_, areaResult] = eventResult
            this.nodeInfoMap[this.node8.childNodes[0]._nid].areaInfo = areaResult
          }))
        }
        .attrs(getNormalAttributes(this.node8))
        .onVisibleAreaChange(getNodeThresholds(this.node8) || [0.0, 1.0], getComponentEventCallback(this.node8, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node8, AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
          const [_, areaResult] = eventResult
          this.nodeInfoMap[this.node8._nid].areaInfo = areaResult
        }))
      }
      if (this.node0.childNodes[4]._attrs.compileIf) {
        if (this.node0.childNodes[4]._attrs.compileIf) {
          Flex(FlexManager.flexOptions(this.node10)) {
            Text(this.node10.childNodes[0].textContent)
            .attrsText(getTextAttributes(this.node10.childNodes[0]))
            .onVisibleAreaChange(getNodeThresholds(this.node10.childNodes[0]) || [0.0, 1.0], getComponentEventCallback(this.node10.childNodes[0], VISIBLE_CHANGE_EVENT_NAME))
            .onAreaChange(getComponentEventCallback(this.node10.childNodes[0], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
              const [_, areaResult] = eventResult
              this.nodeInfoMap[this.node10.childNodes[0]._nid].areaInfo = areaResult
            }))
          }
          .attrs(getNormalAttributes(this.node10))
          .onVisibleAreaChange(getNodeThresholds(this.node10) || [0.0, 1.0], getComponentEventCallback(this.node10, VISIBLE_CHANGE_EVENT_NAME))
          .onAreaChange(getComponentEventCallback(this.node10, AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
            const [_, areaResult] = eventResult
            this.nodeInfoMap[this.node10._nid].areaInfo = areaResult
          }))
        }
      } else {
        Flex(FlexManager.flexOptions(this.node9)) {
          Text(this.node9.childNodes[0].textContent)
          .attrsText(getTextAttributes(this.node9.childNodes[0]))
          .onVisibleAreaChange(getNodeThresholds(this.node9.childNodes[0]) || [0.0, 1.0], getComponentEventCallback(this.node9.childNodes[0], VISIBLE_CHANGE_EVENT_NAME))
          .onAreaChange(getComponentEventCallback(this.node9.childNodes[0], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
            const [_, areaResult] = eventResult
            this.nodeInfoMap[this.node9.childNodes[0]._nid].areaInfo = areaResult
          }))
        }
        .attrs(getNormalAttributes(this.node9))
        .onVisibleAreaChange(getNodeThresholds(this.node9) || [0.0, 1.0], getComponentEventCallback(this.node9, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node9, AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
          const [_, areaResult] = eventResult
          this.nodeInfoMap[this.node9._nid].areaInfo = areaResult
        }))
      }
      if (this.node0.childNodes[5]._attrs.compileIf) {
        Flex(FlexManager.flexOptions(this.node12)) {
          Text(this.node12.childNodes[0].textContent)
          .attrsText(getTextAttributes(this.node12.childNodes[0]))
          .onVisibleAreaChange(getNodeThresholds(this.node12.childNodes[0]) || [0.0, 1.0], getComponentEventCallback(this.node12.childNodes[0], VISIBLE_CHANGE_EVENT_NAME))
          .onAreaChange(getComponentEventCallback(this.node12.childNodes[0], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
            const [_, areaResult] = eventResult
            this.nodeInfoMap[this.node12.childNodes[0]._nid].areaInfo = areaResult
          }))
        }
        .attrs(getNormalAttributes(this.node12))
        .onVisibleAreaChange(getNodeThresholds(this.node12) || [0.0, 1.0], getComponentEventCallback(this.node12, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node12, AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
          const [_, areaResult] = eventResult
          this.nodeInfoMap[this.node12._nid].areaInfo = areaResult
        }))
      } else {
        if (this.node0.childNodes[5]._attrs.compileIf) {
          Flex(FlexManager.flexOptions(this.node11)) {
            Text(this.node11.childNodes[0].textContent)
            .attrsText(getTextAttributes(this.node11.childNodes[0]))
            .onVisibleAreaChange(getNodeThresholds(this.node11.childNodes[0]) || [0.0, 1.0], getComponentEventCallback(this.node11.childNodes[0], VISIBLE_CHANGE_EVENT_NAME))
            .onAreaChange(getComponentEventCallback(this.node11.childNodes[0], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
              const [_, areaResult] = eventResult
              this.nodeInfoMap[this.node11.childNodes[0]._nid].areaInfo = areaResult
            }))
          }
          .attrs(getNormalAttributes(this.node11))
          .onVisibleAreaChange(getNodeThresholds(this.node11) || [0.0, 1.0], getComponentEventCallback(this.node11, VISIBLE_CHANGE_EVENT_NAME))
          .onAreaChange(getComponentEventCallback(this.node11, AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
            const [_, areaResult] = eventResult
            this.nodeInfoMap[this.node11._nid].areaInfo = areaResult
          }))
        }
      }
      if (this.node0.childNodes[6]._attrs.compileIf) {
        Text(this.node0.childNodes[6].textContent)
        .attrsText(getTextAttributes(this.node0.childNodes[6]))
        .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[6]) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[6], VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node0.childNodes[6], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
          const [_, areaResult] = eventResult
          this.nodeInfoMap[this.node0.childNodes[6]._nid].areaInfo = areaResult
        }))
      } else {
        Text(this.node0.childNodes[6].textContent)
        .attrsText(getTextAttributes(this.node0.childNodes[6]))
        .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[6]) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[6], VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node0.childNodes[6], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
          const [_, areaResult] = eventResult
          this.nodeInfoMap[this.node0.childNodes[6]._nid].areaInfo = areaResult
        }))
      }
      Flex(FlexManager.flexOptions(this.node13)) {}
      .attrs(getNormalAttributes(this.node13))
      .onVisibleAreaChange(getNodeThresholds(this.node13) || [0.0, 1.0], getComponentEventCallback(this.node13, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node13, AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
        const [_, areaResult] = eventResult
        this.nodeInfoMap[this.node13._nid].areaInfo = areaResult
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
export default TARO_TEMPLATES_f0t0
`;
function Index() {
    return <View compileMode="f0t0" _dynamicID="node0">

            {condition ? <View hoverClass={myClass} compileIf={condition} _dynamicID="node1">{content}</View> : <Text selectable>hello</Text>}

            {condition1 ? condition2 ? <View compileIf={condition2} _dynamicID="node4">{a}</View> : <Text _dynamicID="node3">{b}</Text> : <View _dynamicID="node2">{c}</View>}

            {condition1 ? <View compileIf={condition1} _dynamicID="node7">{a}</View> : condition2 ? <View compileIf={condition2} _dynamicID="node6">{b}</View> : <Text _dynamicID="node5">{c}</Text>}

            {condition1 ? <View compileIf={condition1} _dynamicID="node8">{a}</View> : condition2 ? <View compileIf={condition2}>{b}</View> : <Text>{c}</Text>}

            {condition1 ? condition2 ? <View compileIf={condition2} _dynamicID="node10">{a}</View> : <View compileIgnore/> : <View _dynamicID="node9">{b}</View>}

            {condition1 ? <View compileIf={condition1} _dynamicID="node12">{a}</View> : condition2 ? <View compileIf={condition2} _dynamicID="node11">{b}</View> : <View compileIgnore/>}

            {condition1 ? "someText" : 789}

            <View hoverClass={myClass} _dynamicID="node13"></View>

          </View>;
}
