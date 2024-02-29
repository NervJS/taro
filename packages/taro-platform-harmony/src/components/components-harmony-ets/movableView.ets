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

function calcPosition(postion: number, start: number, end: number) {
  if (
    postion <= end
      && postion >= start
  ) {
    return postion
  } else if (postion < start) {
    return start
  } else {
    return end
  }

}

@Component
export default struct TaroMovableView {
  node: TaroMovableViewElement | null = null
  startX = 0
  startY = 0
  offsetX = 0
  offsetY = 0
  selfWidth: Length = 0
  selfHeight: Length = 0
  @State x: number = 0
  @State y: number = 0
  @Consume areaWidth: Length
  @Consume areaHeight: Length

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
          .onTouch((e) => {
            if (!this.node || this.node.getAttribute('disabled')) return
            const direction = this.node.getAttribute('direction')
            const touchItem = e.touches[0]
            const x = touchItem.displayX
            const y = touchItem.displayY
            if (e.type === TouchType.Down) {
              this.startX = this.x
              this.startY = this.y
              this.offsetX = x
              this.offsetY = y
            } else if (e.type === TouchType.Move) {
              console.info('movableView::area', ' width:', this.areaWidth, '-height:', this.areaHeight)
              console.info('movableView::newx', this.startX + (x - this.offsetX))
              console.info('movableView::newy', this.startY + (y - this.offsetY))
              console.info('movableView::', typeof this.areaWidth)
              const areaWidthEnd = Number(this.areaWidth) - Number(this.selfWidth)
              const areaHeightEnd = Number(this.areaHeight) - Number(this.selfHeight)

              if (['all', 'vertical'].includes(direction)) {

                const nextX = this.startX + (x - this.offsetX)
                this.x = calcPosition(nextX, 0, areaWidthEnd)
              }

              if (['all', 'horizontal'].includes(direction)) {

                const nextY = this.startY + (y - this.offsetY)
                this.y = calcPosition(nextY, 0, areaHeightEnd)
              }

            }


          })
        }
      }
      .translate({ x: this.x, y: this.y })
      .onAreaChange((oldValue: Area, newValue: Area) => {
        this.selfWidth = newValue.width
        this.selfHeight = newValue.height
      })
    }

  }
}
