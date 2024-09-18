import { isTaroMovableViewElement } from '@tarojs/runtime'
import commonStyleModify, { rowModify, columnModify } from './style'

import { FlexManager } from './utils/flexManager'

import type { TaroAny, TaroMovableAreaElement } from '@tarojs/runtime'

@Component
export default struct TaroMovableArea {
  @Builder
  customBuilder() {
  }

  @BuilderParam createLazyChildren: (node: TaroMovableAreaElement, layer?: number) => void = this.customBuilder
  @ObjectLink node: TaroMovableAreaElement
  @State overwriteStyle: Record<string, TaroAny> = {}

  aboutToAppear(): void {
    if (this.node) {
      this.node._instance = this
    }
  }





  build() {
    if (FlexManager.useFlexLayout(this.node)) {
      Flex(FlexManager.flexOptions(this.node)) {
        this.createLazyChildren(this.node, 0)
      }
      .attributeModifier(commonStyleModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
      .clip(true)
      .onSizeChange((oldValue: SizeOptions, newValue: SizeOptions) => {
        sizeChangeHandle(this.node, newValue)
      })
      .gesture(
        PinchGesture({ fingers: 2 }).onActionStart((event: GestureEvent) => {
          this.node.childNodes.forEach(item => {
            if (isTaroMovableViewElement(item)) {
              item.startScale()
            }
          })
        }).onActionUpdate((event) => {
          const scaleArea = this.node.getAttribute('scaleArea')
          if (scaleArea) {
            this.node.childNodes.forEach(item => {
              if (isTaroMovableViewElement(item)) {
                item.doScale(event.scale)
              }
            })
          }
        })
      )
    } else if (FlexManager.isFlexNode(this.node) && FlexManager.direction(this.node) !== FlexDirection.Column) {
      Row() {
        this.createLazyChildren(this.node, 0)
      }
      .attributeModifier(rowModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
      .clip(true)
      .onSizeChange((oldValue: SizeOptions, newValue: SizeOptions) => {
        sizeChangeHandle(this.node, newValue)
      })
      .gesture(
        PinchGesture({ fingers: 2 }).onActionStart((event: GestureEvent) => {
          this.node.childNodes.forEach(item => {
            if (isTaroMovableViewElement(item)) {
              item.startScale()
            }
          })
        }).onActionUpdate((event) => {
          const scaleArea = this.node.getAttribute('scaleArea')
          if (scaleArea) {
            this.node.childNodes.forEach(item => {
              if (isTaroMovableViewElement(item)) {
                item.doScale(event.scale)
              }
            })
          }
        })
      )
    } else {
      Column() {
        this.createLazyChildren(this.node, 0)
      }
      .attributeModifier(columnModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
      .clip(true)
      .onSizeChange((oldValue: SizeOptions, newValue: SizeOptions) => {
        sizeChangeHandle(this.node, newValue)
      })
      .gesture(
        PinchGesture({ fingers: 2 }).onActionStart((event: GestureEvent) => {
          this.node.childNodes.forEach(item => {
            if (isTaroMovableViewElement(item)) {
              item.startScale()
            }
          })
        }).onActionUpdate((event) => {
          const scaleArea = this.node.getAttribute('scaleArea')
          if (scaleArea) {
            this.node.childNodes.forEach(item => {
              if (isTaroMovableViewElement(item)) {
                item.doScale(event.scale)
              }
            })
          }
        })
      )
    }
  }
}


function sizeChangeHandle(node: TaroMovableAreaElement, newValue: Area | SizeOptions) {
  node.childNodes.forEach(item => {
    if (isTaroMovableViewElement(item)) {
      if (item.area?.w !== Number(newValue.width) || item.area?.h !== Number(newValue.height)) {
        item.area = {
          w: Number(newValue.width),
          h: Number(newValue.height)
        }
      }
    }
  })
}
