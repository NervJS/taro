import type { TaroAny, TaroMovableViewElement, TaroElement } from '@tarojs/runtime'

import commonStyleModify, { rowModify, columnModify } from './style'

import { FlexManager } from './utils/flexManager'



@Component
export default struct TaroMovableView {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroMovableViewElement, layer?: number) => void = this.customBuilder
  @ObjectLink node: TaroMovableViewElement
  @State overwriteStyle: Record<string, TaroAny> = {}

  aboutToAppear(): void {
    if (this.node) {
      this.node._instance = this

    }
  }

  build() {
    Stack() {
      if (FlexManager.useFlexLayout(this.node)) {
        Flex(FlexManager.flexOptions(this.node)) {
          this.createLazyChildren(this.node, 0)
        }
        .attributeModifier(commonStyleModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
      } else if (FlexManager.isFlexNode(this.node) && FlexManager.direction(this.node) !== FlexDirection.Column) {
        Row() {
          this.createLazyChildren(this.node, 0)
        }
        .attributeModifier(rowModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
      } else {
        Column() {
          this.createLazyChildren(this.node, 0)
        }
        .attributeModifier(columnModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
      }
    }
    .translate({ x: this.node.position.x, y: this.node.position.y })
    .scale({ x: this.node.scaleValue, y: this.node.scaleValue })
    .onSizeChange((oldValue: SizeOptions, newValue: SizeOptions) => {
      if (this.node.selfSize?.w !== Number(newValue.width) || this.node.selfSize?.h !== Number(newValue.height)) {
        this.node.selfSize = { w: Number(newValue.width), h: Number(newValue.height) }
      }
    })
    .visibility(this.node.visibility)
    .gesture(
      GestureGroup(GestureMode.Parallel,
        PanGesture(getPanOption(this.node)).onActionStart((e: GestureEvent) => {

          this.node.startMove()
          this.node.callTouchEventFnFromGesture('touchstart', e)
        }).onActionUpdate((e: GestureEvent) => {
          this.node.callTouchEventFnFromGesture('touchmove', e)
          this.node.doMove({
            x: e.offsetX,
            y: e.offsetY
          })

        }).onActionEnd((e: GestureEvent) => {
          this.node.callTouchEventFnFromGesture('touchend', e)
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


function getPanOption(node: TaroMovableViewElement) {
  const attrDirection = node.getAttribute('direction')
  let panDirection = PanDirection.All

  if(node.getAttribute('disabled')) {
    panDirection = PanDirection.None
  } else if(attrDirection === 'horizontal') {
    panDirection = PanDirection.Horizontal
  } else if (attrDirection === 'vertical') {
    panDirection = PanDirection.Vertical
  }
  return new PanGestureOptions({
    direction: panDirection,
    fingers: 1
  })
}