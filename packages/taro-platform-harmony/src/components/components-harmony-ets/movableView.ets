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
  @ObjectLink node: TaroMovableViewElement
  selfWidth: Length = 0
  selfHeight: Length = 0
  pinchValue: number = 1
  positionX: number = 0
  positionY: number = 0
  @State @Watch('onScaleUpdated') selfScaleValue: number = 1
  @State x: number = 0
  @State y: number = 0
  @Consume areaWidth: Length
  @Consume areaHeight: Length
  @Consume @Watch('onScaleUpdated') scaleValue: number

  onScaleUpdated() {
    const areaWidthEnd = Number(this.areaWidth) - Number(this.selfWidth) * this.scaleValue * this.selfScaleValue
    const areaHeightEnd = Number(this.areaHeight) - Number(this.selfHeight) * this.scaleValue * this.selfScaleValue

    const incrementWidth = (this.scaleValue * this.selfScaleValue - 1) * Number(this.selfWidth)
    const incrementHeight = (this.scaleValue * this.selfScaleValue - 1) * Number(this.selfHeight)

    this.x = calcPosition(this.x, incrementWidth * 0.5, areaWidthEnd + incrementWidth * 0.5)
    this.y = calcPosition(this.y, incrementHeight * 0.5, areaHeightEnd + incrementHeight * 0.5)
  }

  // handleTouch = (e: TouchEvent) => {
  //   if (!this.node || this.node.getAttribute('disabled')) return
  //   const direction = this.node.getAttribute('direction')
  //   const touchItem = e.touches[0]
  //   const x = touchItem.displayX
  //   const y = touchItem.displayY
  //   if (e.type === TouchType.Down) {
  //     this.startX = this.x
  //     this.startY = this.y
  //     this.fingerStartX = x
  //     this.fingerStartY = y
  //   } else if (e.type === TouchType.Move) {
  //     console.info('movableView::area', ' width:', this.areaWidth, '-height:', this.areaHeight)
  //     console.info('movableView::newx', this.startX + (x - this.fingerStartX))
  //     console.info('movableView::newy', this.startY + (y - this.fingerStartY))
  //     console.info('movableView::', typeof this.areaWidth)
  //     const areaWidthEnd = Number(this.areaWidth) - Number(this.selfWidth) * this.scaleValue * this.selfScaleValue
  //     const areaHeightEnd = Number(this.areaHeight) - Number(this.selfHeight) * this.scaleValue * this.selfScaleValue
  //
  //     const fingerOffsetX = x - this.fingerStartX
  //     const fingerOffsetY = y - this.fingerStartY
  //
  //     const incrementWidth = (this.scaleValue * this.selfScaleValue - 1) * Number(this.selfWidth)
  //     const incrementHeight = (this.scaleValue * this.selfScaleValue - 1) * Number(this.selfHeight)
  //
  //     if (['all', 'vertical'].includes(direction)) {
  //       const nextX = this.startX + fingerOffsetX
  //       this.x = calcPosition(nextX, incrementWidth * 0.5, areaWidthEnd + incrementWidth * 0.5)
  //     }
  //
  //     if (['all', 'horizontal'].includes(direction)) {
  //
  //       const nextY = this.startY + fingerOffsetY
  //       this.y = calcPosition(nextY, incrementHeight * 0.5, areaHeightEnd + incrementHeight * 0.5)
  //     }
  //
  //   }
  // }

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
          // .onTouch((e) => {
          //   this.handleTouch(e)
          // })
          .gesture(
            GestureGroup(GestureMode.Parallel,
              PanGesture({}).onActionStart((e: GestureEvent) => {
                this.positionX = this.x
                this.positionY = this.y
              }).onActionUpdate((e: GestureEvent) => {
                if (!this.node || this.node.getAttribute('disabled')) return
                const direction = this.node.getAttribute('direction')

                // 最终缩放比例
                const scale = this.scaleValue * this.selfScaleValue

                // 容器的宽高终点
                const areaWidthEnd = Number(this.areaWidth) - Number(this.selfWidth) * scale
                const areaHeightEnd = Number(this.areaHeight) - Number(this.selfHeight) * scale

                // 缩放后的容器和原来容器的宽高差
                const incrementWidth = (scale - 1) * Number(this.selfWidth)
                const incrementHeight = (scale - 1) * Number(this.selfHeight)

                if (['all', 'vertical'].includes(direction)) {
                  const nextX = this.positionX + e.offsetX
                  this.x = calcPosition(nextX, incrementWidth * 0.5, areaWidthEnd + incrementWidth * 0.5)
                }

                if (['all', 'horizontal'].includes(direction)) {
                  const nextY = this.positionY + e.offsetY
                  this.y = calcPosition(nextY, incrementHeight * 0.5, areaHeightEnd + incrementHeight * 0.5)
                }

              }),
              PinchGesture({ fingers: 2 }).onActionStart((event: GestureEvent) => {
                console.info('movableArea::Pinch start 2');
                this.pinchValue = this.selfScaleValue
              }).onActionUpdate((event) => {
                this.selfScaleValue = this.pinchValue * event.scale;
                console.info('movableArea::update2', this.selfScaleValue)
              })
            )
          )
        } else {
          Column() {
            createLazyChildren(this.node)
          }
          .attributeModifier(commonStyleModify.setNode(this.node))
          .columnAttrs(getNormalAttributes(this.node))
          .alignItems(FlexManager.flexOptions(this.node).alignItems as HorizontalAlign)
          .justifyContent(FlexManager.flexOptions(this.node).justifyContent)
          .onDragStart((e) => {
            console.info('movableView::', 'dragStart')
          })
          // .onTouch((e) => {
          //   this.handleTouch(e)
          // })
          .gesture(
            GestureGroup(GestureMode.Parallel,
              PanGesture({}).onActionStart((e: GestureEvent) => {
                this.positionX = this.x
                this.positionY = this.y
              }).onActionUpdate((e: GestureEvent) => {
                if (!this.node || this.node.getAttribute('disabled')) return
                const direction = this.node.getAttribute('direction')

                // 最终缩放比例
                const scale = this.scaleValue * this.selfScaleValue

                // 容器的宽高终点
                const areaWidthEnd = Number(this.areaWidth) - Number(this.selfWidth) * scale
                const areaHeightEnd = Number(this.areaHeight) - Number(this.selfHeight) * scale

                // 缩放后的容器和原来容器的宽高差
                const incrementWidth = (scale - 1) * Number(this.selfWidth)
                const incrementHeight = (scale - 1) * Number(this.selfHeight)

                if (['all', 'vertical'].includes(direction)) {
                  const nextX = this.positionX + e.offsetX * scale
                  this.x = calcPosition(nextX, incrementWidth * 0.5, areaWidthEnd + incrementWidth * 0.5)
                }

                if (['all', 'horizontal'].includes(direction)) {
                  const nextY = this.positionY + e.offsetY * scale
                  this.y = calcPosition(nextY, incrementHeight * 0.5, areaHeightEnd + incrementHeight * 0.5)
                }

              }),
              PinchGesture({ fingers: 2 }).onActionStart((event: GestureEvent) => {
                console.info('movableArea::Pinch start 2');
                this.pinchValue = this.selfScaleValue
              }).onActionUpdate((event) => {
                this.selfScaleValue = this.pinchValue * event.scale;
                console.info('movableArea::update2', this.selfScaleValue)
              })
            )
          )

        }

      }
      .translate({ x: this.x, y: this.y })
      .scale({ x: this.scaleValue * this.selfScaleValue, y: this.scaleValue * this.selfScaleValue })
      .onAreaChange((oldValue: Area, newValue: Area) => {
        this.selfWidth = newValue.width
        this.selfHeight = newValue.height
      })

    }
  }
}
