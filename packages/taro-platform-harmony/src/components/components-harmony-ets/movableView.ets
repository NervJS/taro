import type { TaroMovableViewElement, TaroStyleType, TaroAny } from '@tarojs/runtime'

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
export default struct TaroMovableView {
  @ObjectLink node: TaroMovableViewElement

  build() {
    if (this.node) {
      Stack() {
        if (FlexManager.isFlexNode(this.node) && FlexManager.flexOptions(this.node)
          .direction !== FlexDirection.Column) {
          Row() {
            createLazyChildren(this.node)
          }
          .attributeModifier(commonStyleModify.setNode(this.node))
          .rowAttrs(getNormalAttributes(this.node))
          .alignItems(FlexManager.flexOptions(this.node).alignItems as VerticalAlign)
          .justifyContent(FlexManager.flexOptions(this.node).justifyContent)
        } else {
          Column() {
            createLazyChildren(this.node)
          }
          .attributeModifier(commonStyleModify.setNode(this.node))
          .columnAttrs(getNormalAttributes(this.node))
          .alignItems(FlexManager.flexOptions(this.node).alignItems as HorizontalAlign)
          .justifyContent(FlexManager.flexOptions(this.node).justifyContent)
        }
      }
      .translate({ x: this.node.position.x, y: this.node.position.y })
      .scale({ x: this.node.scaleValue, y: this.node.scaleValue })
      .onAreaChange((oldValue: Area, newValue: Area) => {
        this.node.selfSize = {w: Number(newValue.width), h: Number(newValue.height)}
      })
      .gesture(
        GestureGroup(GestureMode.Exclusive,
          PanGesture({fingers:1}).onActionStart((e: GestureEvent) => {

            this.node.startMove()
          }).onActionUpdate((e: GestureEvent) => {

            this.node.doMove({
              x: e.offsetX,
              y: e.offsetY
            })
            // 事件处理
            const bindchange = this.node.getAttribute('bindchange')
            if (typeof bindchange === 'function') {
            }

          }).onActionEnd(() => {
            // this.updatePosition()
            this.node.checkPositionBoundary(this.node.position, this.node.scaleValue)
          }),
          PinchGesture({ fingers: 2 }).onActionStart((event: GestureEvent) => {
            this.node.startScale()
          }).onActionUpdate((event) => {
            this.node.doScale(event.scale)
          })
        )
      )
    }
  }
}
