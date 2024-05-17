import type { TaroAny, TaroMovableAreaElement, TaroMovableViewElement } from '@tarojs/runtime'
import { isTaroMovableViewElement } from '@tarojs/runtime'
import commonStyleModify, { rowModify, columnModify } from './style'

import { FlexManager } from './utils/flexManager'
import { isUndefined } from '@tarojs/shared'

@Component
export default struct TaroMovableArea {
  @Builder
  customBuilder() {
  }

  @BuilderParam createLazyChildren: (node: TaroMovableAreaElement) => void = this.customBuilder
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
        this.createLazyChildren(this.node)
      }
      .attributeModifier(commonStyleModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
      .clip(true)
      .onAreaChange((oldValue: Area, newValue: Area) => {
        areaChangeHandle(this.node, newValue)
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
        this.createLazyChildren(this.node)
      }
      .attributeModifier(rowModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
      .clip(true)
      .onAreaChange((oldValue: Area, newValue: Area) => {
        areaChangeHandle(this.node, newValue)
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
        this.createLazyChildren(this.node)
      }
      .attributeModifier(columnModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
      .clip(true)
      .onAreaChange((oldValue: Area, newValue: Area) => {
        areaChangeHandle(this.node, newValue)
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
function areaChangeHandle(node: TaroMovableAreaElement,newValue: Area) {
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