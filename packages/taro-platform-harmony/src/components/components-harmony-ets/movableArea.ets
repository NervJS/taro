import type { TaroMovableAreaElement, TaroStyleType } from '@tarojs/runtime'
import commonStyleModify from './style'
import { createLazyChildren } from './render'

import { FlexManager } from './utils/FlexManager'
import { getNormalAttributes } from './utils/helper'


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
  @ObjectLink node: TaroMovableAreaElement
  @Provide areaWidth: Length = 0
  @Provide areaHeight: Length = 0
  @Provide scaleValue: number = 1
  pinchValue:number = 1


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
        .onTouch(() => {
          console.info('movableArea::touch1')
        })
        .gesture(
          PinchGesture({ fingers: 2 }).onActionStart((event: GestureEvent) => {
            console.info('movableArea::Pinch start 2');
            this.pinchValue = this.scaleValue
          }).onActionUpdate((event) => {
            this.scaleValue = this.pinchValue * event.scale;
            console.info('movableArea::update2', this.scaleValue)
          })
        )
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
        .gesture(
          PinchGesture({ fingers: 2 }).onActionStart((event: GestureEvent) => {
            console.info('movableArea::Pinch start 2');
            this.pinchValue = this.scaleValue
          }).onActionUpdate((event) => {
            this.scaleValue = this.pinchValue * event.scale;
            console.info('movableArea::update2', this.scaleValue)
          })
        )
      }
    }
  }
}
