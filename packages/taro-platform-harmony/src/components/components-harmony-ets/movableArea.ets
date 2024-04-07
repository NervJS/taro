import type { TaroAny, TaroMovableAreaElement, TaroMovableViewElement } from '@tarojs/runtime'
import { rowModify, columnModify } from './style'

import { FlexManager } from './utils/flexManager'

@Component
export default struct TaroMovableArea {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroMovableAreaElement) => void = this.customBuilder
  @ObjectLink node: TaroMovableAreaElement
  @State overwriteStyle: Record<string, TaroAny> = {}

  aboutToAppear(): void {
    if (this.node) {
      this.node._instance = this
    }
  }

  build() {
    if (FlexManager.isFlexNode(this.node) && FlexManager.flexOptions(this.node).direction !== FlexDirection.Column) {
      Row() {
        this.createLazyChildren(this.node)
      }
      .attributeModifier(rowModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
      .alignItems(FlexManager.flexOptions(this.node).alignItems as VerticalAlign)
      .justifyContent(FlexManager.flexOptions(this.node).justifyContent)
      .clip(true)
      .onAreaChange((oldValue: Area, newValue: Area) => {
        this.node.childNodes.forEach(item => {
          if(item.nodeName === 'MOVABLE-VIEW') {
            ;(item as TaroMovableViewElement).area = {
              w: Number( newValue.width),
              h: Number(newValue.height)
            }
          }
        })
      })
      .gesture(
        PinchGesture({ fingers: 2 }).onActionStart((event: GestureEvent) => {
          this.node.childNodes.forEach(item => {
            if(item.nodeName === 'MOVABLE-VIEW') {
              ;(item as TaroMovableViewElement).startScale()
            }
          })
        }).onActionUpdate((event) => {
          const scaleArea = this.node.getAttribute('scaleArea')
          if (scaleArea) {
            this.node.childNodes.forEach(item => {
              if(item.nodeName === 'MOVABLE-VIEW') {
                ;(item as TaroMovableViewElement).doScale(event.scale)
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
      .alignItems(FlexManager.flexOptions(this.node).alignItems as HorizontalAlign)
      .justifyContent(FlexManager.flexOptions(this.node).justifyContent)
      .clip(true)
      .onAreaChange((oldValue: Area, newValue: Area) => {
        this.node.childNodes.forEach(item => {
          if(item.nodeName === 'MOVABLE-VIEW') {
            ;(item as TaroMovableViewElement).area = {
              w: Number( newValue.width),
              h: Number(newValue.height)
            }
          }
        })
      })
      .gesture(
        PinchGesture({ fingers: 2 }).onActionStart((event: GestureEvent) => {
          this.node.childNodes.forEach(item => {
            if(item.nodeName === 'MOVABLE-VIEW') {
              ;(item as TaroMovableViewElement).startScale()
            }
          })
        }).onActionUpdate((event) => {
          const scaleArea = this.node.getAttribute('scaleArea')
          if (scaleArea) {
            this.node.childNodes.forEach(item => {
              if(item.nodeName === 'MOVABLE-VIEW') {
                ;(item as TaroMovableViewElement).doScale(event.scale)
              }
            })
          }
        })
      )
    }
  }
}
