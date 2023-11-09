import { eventHandler, convertNumber2PX } from '@tarojs/runtime'

import TaroComponentWrapper from './base'
import { ICON_SVG_MAP } from './utils/constant/icon'
import { bindInstanceToNode, bindAnimation, getNormalAttributes, shouldBindEvent, getComponentEventCallback, getNodeVisibleChange, getNodeAttributeOrNull } from './utils/helper'

import type { TaroImageElement } from '@tarojs/runtime'

@Extend(Image)
function attrs ({
  id,
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
  transform,
}) {
  .id(id)
  .constraintSize(constraintSize)
  .flexGrow(flexGrow)
  .flexShrink(flexShrink)
  .flexBasis(flexBasis)
  .alignSelf(alignSelf)
  .width(width)
  .height(height)
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


@Component
struct TaroIcon {
  nodeInfoMap: any = {}

  eventMap: any = {}

  @State thresholds: number[] | null = null

  @State isAreaChangeTap: boolean = false

  @State overwriteStyle: Record<string, any> = {}

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(this.thresholds || [0.0, 1.0], getNodeVisibleChange(this))
  }

  @ObjectLink node: TaroImageElement

  aboutToAppear () {
    bindInstanceToNode(this.node, this)
    // 绑定动画
    bindAnimation(this.node, (rule) => {
      this.overwriteStyle = rule
    })
    
    this.nodeInfoMap[this.node._nid] = {}
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
    .onAreaChange(getComponentEventCallback('areaChange', ({ eventResult }) => {
      const [_, areaResult] = eventResult
      
      this.nodeInfoMap[this.node._nid].areaInfo = areaResult
    }, this))
  }

  getIconData () {
    if (!this.node || !this.node._attrs) return null

    const type = this.node._attrs.type


    // TODO：等待鸿蒙支持 base64 格式的 svg 图片，或者工程化支持图片资源的迁移
    return ICON_SVG_MAP[type] || null
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      Image(this.getIconData())
        .defaultEvent()
        .objectFit(ImageFit.Contain)
        .fillColor(getNodeAttributeOrNull(this.node, 'color'))
        .onComplete(e => eventHandler(e, 'complete', this.node))
        .attrs(getNormalAttributes(this.node, this.overwriteStyle))
        .size({
          width: convertNumber2PX(getNodeAttributeOrNull(this.node, 'size') || 23),
          height: convertNumber2PX(getNodeAttributeOrNull(this.node, 'size') || 23),
        })
        .visibleChangeEvent()
    }
  }
}

export default TaroIcon
