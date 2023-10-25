import { eventHandler, convertNumber2PX } from '@tarojs/runtime'

import TaroComponentWrapper from './base'
import { ICON_SVG_MAP } from './utils/constant/icon'
import { bindInstanceToNode, bindAnimation, getNormalAttributes, shouldBindEvent, getNodeAreaChange, getNodeAttributeOrNull } from './utils/helper'

import type { TaroImageElement } from '@tarojs/runtime'

@Extend(Image)
function attrs ({
   flexSize,
   alignSelf,
   margin,
   padding,
   zIndex,
   backgroundColor,
   borderRadius,
   constraintSize,
   rotate,
   scale,
   translate,
   transform
}) {
  .constraintSize(constraintSize)
  .zIndex(zIndex)
  .margin(margin)
  .padding(padding)
  .alignSelf(alignSelf)
  .flexGrow(flexSize[0])
  .flexShrink(flexSize[1])
  .flexBasis(flexSize[2])
  .backgroundColor(backgroundColor)
  .borderRadius(borderRadius)
  .rotate(rotate)
  .scale(scale)
  .translate(translate)
  .transform(transform)
}


@Component
struct TaroIcon {
  info: Area = null

  @State thresholds: number[] = []

  @State isAreaChangeTap: boolean = false
  
  @State overwriteStyle: Record<string, any> = {}

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(this.thresholds || [0.0, 1.0], (isVisible: boolean, currentRatio: number) => {
      this.visableChange(isVisible, currentRatio)
    })
  }

  @ObjectLink node: TaroImageElement

  aboutToAppear () {
    bindInstanceToNode(this.node, this)
    // 绑定动画
    bindAnimation(this.node, (rule) => {
      this.overwriteStyle = rule
    })
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
    .onAreaChange(getNodeAreaChange((areaResult: Area) => {
      this.info = areaResult
    }, this))
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
  }

  getIconData () {
    if (!this.node || !this.node._attrs) return null
    
    const type = this.node._attrs.type


    // TODO：等待鸿蒙支持 base64 格式的 svg 图片，或者工程化支持图片资源的迁移
    return ICON_SVG_MAP[type] || null
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      if (!this.thresholds.length) {
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
      } else {
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
}

export default TaroIcon
