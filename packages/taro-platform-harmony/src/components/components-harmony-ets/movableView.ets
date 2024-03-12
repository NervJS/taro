import type { TaroMovableViewElement } from '@tarojs/runtime'

import { rowModify, columnModify } from './style'

import { FlexManager } from './utils/flexManager'

@Component
export default struct TaroMovableView {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroMovableViewElement) => void = this.customBuilder
  @ObjectLink node: TaroMovableViewElement

  build() {
    if (this.node && this.node.hmStyle?.display !== 'none') {
      Stack() {
        if (FlexManager.isFlexNode(this.node) && FlexManager.flexOptions(this.node)
          .direction !== FlexDirection.Column) {
          Row() {
            this.createLazyChildren(this.node)
          }
          .attributeModifier(rowModify.setNode(this.node))
          .alignItems(FlexManager.flexOptions(this.node).alignItems as VerticalAlign)
          .justifyContent(FlexManager.flexOptions(this.node).justifyContent)
        } else {
          Column() {
            this.createLazyChildren(this.node)
          }
          .attributeModifier(columnModify.setNode(this.node))
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
