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
@Extend(Image)
function attrsImage ({
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
  .objectFit(ImageFit.Contain)
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
  
  build() {
    Flex(FlexManager.flexOptions(this.node0)) {
      Flex(FlexManager.flexOptions(this.node0.childNodes[0])) {}
      .attrs(getNormalAttributes(this.node0.childNodes[0]))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[0]) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[0], VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[0], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
        const [_, areaResult] = eventResult
        this.nodeInfoMap[this.node0.childNodes[0]._nid].areaInfo = areaResult
      }))
      Flex(FlexManager.flexOptions(this.node0.childNodes[1])) {
        Image(this.node0.childNodes[1].childNodes[0].getAttribute('src'))
        .attrsImage(getNormalAttributes(this.node0.childNodes[1].childNodes[0]))
        .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[1].childNodes[0]) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[1].childNodes[0], VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node0.childNodes[1].childNodes[0], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
          const [_, areaResult] = eventResult
          this.nodeInfoMap[this.node0.childNodes[1].childNodes[0]._nid].areaInfo = areaResult
        }))
      }
      .attrs(getNormalAttributes(this.node0.childNodes[1]))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[1]) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[1], VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[1], AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
        const [_, areaResult] = eventResult
        this.nodeInfoMap[this.node0.childNodes[1]._nid].areaInfo = areaResult
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
`
function Index() {
    return <View compileMode="f0t0" _dynamicID="node0">
        <View/>
        <View>
          <Image/>
        </View>
      </View>
}
