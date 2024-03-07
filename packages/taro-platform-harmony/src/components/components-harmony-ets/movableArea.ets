import type { TaroMovableAreaElement, TaroStyleType, TaroMovableViewElement} from '@tarojs/runtime'
import commonStyleModify from './style'
import { createLazyChildren } from './render'

import { FlexManager } from './utils/flexManager'
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

  build() {
    if (this.node && this.node.hmStyle?.display !== 'none') {
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
          createLazyChildren(this.node)
        }
        .attributeModifier(commonStyleModify.setNode(this.node))
        .columnAttrs(getNormalAttributes(this.node))
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
}
