import type { TaroMovableViewElement, TaroStyleType } from '@tarojs/runtime'

import commonStyleModify from './style'
import { createLazyChildren } from './render'

import { FlexManager } from './utils/FlexManager'
import { getNormalAttributes, } from './utils/helper'
@Extend(Row)
function rowAttrs(style: TaroStyleType) {
  .constraintSize({
    minWidth: style.minWidth || style.width,
    maxWidth: style.maxWidth,
    minHeight: style.minHeight,
    maxHeight: style.maxHeight
  })
}

@Extend(Column)
function columnAttrs(style: TaroStyleType) {
  .constraintSize({
    minWidth: style.minWidth,
    maxWidth: style.maxWidth,
    minHeight: style.minHeight || style.height,
    maxHeight: style.maxHeight
  })
}

@Component
export default struct TaroMovableArea {
  @ObjectLink node: TaroMovableViewElement

  @Provide areaWidth: Length = 0
  @Provide areaHeight: Length = 0

  build() {
    if (this.node) {
      if (FlexManager.isFlexNode(this.node) && FlexManager.flexOptions(this.node).direction !== FlexDirection.Column) {
        Row() {
          createLazyChildren(this.node)
        }
        .attributeModifier(commonStyleModify.setNode(this.node))
        .rowAttrs(getNormalAttributes(this.node))
        .alignItems(FlexManager.flexOptions(this.node).alignItems as VerticalAlign)
        .justifyContent(FlexManager.flexOptions(this.node).justifyContent)
        .clip(true)
        .onAreaChange((oldValue: Area, newValue: Area) => {
          this.areaWidth = newValue.width
          this.areaHeight = newValue.height
        })
      } else {
        Column() {
          createLazyChildren(this.node)
        }
        .attributeModifier(commonStyleModify.setNode(this.node))
        .columnAttrs(getNormalAttributes(this.node))
        .alignItems(FlexManager.flexOptions(this.node).alignItems as HorizontalAlign)
        .justifyContent(FlexManager.flexOptions(this.node).justifyContent)
        .clip(true)
        .onAreaChange((oldValue: Area, newValue: Area) => {
          this.areaWidth = newValue.width
          this.areaHeight = newValue.height
        })
      }
    }
  }
}
