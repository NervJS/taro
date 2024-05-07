import type { TaroAny, TaroMovableViewElement } from '@tarojs/runtime'

import commonStyleModify, { rowModify, columnModify } from './style'

import { FlexManager } from './utils/flexManager'
import { isUndefined } from '@tarojs/shared'

@Component
export default struct TaroMovableView {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroMovableViewElement) => void = this.customBuilder
  @ObjectLink node: TaroMovableViewElement
  @State overwriteStyle: Record<string, TaroAny> = {}

  aboutToAppear(): void {
    if (this.node) {
      this.node._instance = this

      setTimeout(() => {
        const x = this.node.getAttribute('x') ? +this.node.getAttribute('x') : 0
        const y = this.node.getAttribute('y') ? +this.node.getAttribute('y') : 0
        this.node.checkPositionBoundary({ x, y }, this.node.scaleValue)
      }, 0)
    }
  }

  build() {
    Stack() {
      if (FlexManager.useFlexLayout(this.node)) {
        Flex(FlexManager.flexOptions(this.node)) {
          this.createLazyChildren(this.node)
        }
        .attributeModifier(commonStyleModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
      } else if (FlexManager.isFlexNode(this.node) && FlexManager.direction(this.node) !== FlexDirection.Column) {
        Row() {
          this.createLazyChildren(this.node)
        }
        .attributeModifier(rowModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
      } else {
        Column() {
          this.createLazyChildren(this.node)
        }
        .attributeModifier(columnModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
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
