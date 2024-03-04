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
  @State x: number = 0
  @State y: number = 0
  @Consume areaWidth: Length
  @Consume areaHeight: Length
  @State @Watch('onSelfScaleUpdated') selfScaleValue: number = 1
  @Consume @Watch('onScaleUpdated') scaleValue: number

  onScaleUpdated() {
    const scaleMin = this.node.getAttribute('scale-min')
    const scaleMax = this.node.getAttribute('scale-max')

    if (scaleMin && Number(scaleMin) >= 0.1 && this.getScale() < Number(scaleMin)) {
      this.selfScaleValue = Number(scaleMin) / this.scaleValue
    } else if (scaleMax && Number(scaleMax) >= 0.1 && this.getScale() > Number(scaleMax)) {
      this.selfScaleValue = Number(scaleMax) / this.scaleValue
    } else {
      this.updatePosition()
    }

  }

  getOutOfBounds() {
    if (this.node.getAttribute('out-of-bounds')) {

      return Number(this.selfWidth) / 3
    }
    return 0
  }

  onSelfScaleUpdated() {
    const scaleMin = this.node.getAttribute('scale-min')
    const scaleMax = this.node.getAttribute('scale-max')

    if (scaleMin && Number(scaleMin) >= 0.1 && this.getScale() < Number(scaleMin)) {
      this.scaleValue = Number(scaleMin) / this.selfScaleValue
    } else if (scaleMax && Number(scaleMax) >= 0.1 && this.getScale() > Number(scaleMax)) {
      this.scaleValue = Number(scaleMax) / this.selfScaleValue
    } else {
      this.updatePosition()
    }
  }

  getScale() {
    if (this.node.getAttribute('scale')) {
      return this.scaleValue * this.selfScaleValue
    }
    return this.scaleValue * this.selfScaleValue
  }

  updatePosition() {
    const areaWidthEnd = Number(this.areaWidth) - Number(this.selfWidth) * this.getScale()
    const areaHeightEnd = Number(this.areaHeight) - Number(this.selfHeight) * this.getScale()

    const incrementWidth = (this.getScale() - 1) * Number(this.selfWidth)
    const incrementHeight = (this.getScale() - 1) * Number(this.selfHeight)

    this.x = calcPosition(this.x, incrementWidth * 0.5, areaWidthEnd + incrementWidth * 0.5)
    this.y = calcPosition(this.y, incrementHeight * 0.5, areaHeightEnd + incrementHeight * 0.5)
  }

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
          .gesture(
            GestureGroup(GestureMode.Parallel,
              PanGesture({}).onActionStart((e: GestureEvent) => {
                this.positionX = this.x
                this.positionY = this.y
              }).onActionUpdate((e: GestureEvent) => {
                if (!this.node || this.node.getAttribute('disabled')) return
                const direction = this.node.getAttribute('direction')

                // 容器的宽高终点
                const areaWidthEnd = Number(this.areaWidth) - Number(this.selfWidth) * this.getScale()
                const areaHeightEnd = Number(this.areaHeight) - Number(this.selfHeight) * this.getScale()

                // 缩放后的容器和原来容器的宽高差
                const incrementWidth = (this.getScale() - 1) * Number(this.selfWidth)
                const incrementHeight = (this.getScale() - 1) * Number(this.selfHeight)

                if (['all', 'horizontal'].includes(direction)) {
                  const nextX = this.positionX + e.offsetX * this.getScale()
                  this.x = calcPosition(nextX, incrementWidth * 0.5 - this.getOutOfBounds(), areaWidthEnd + incrementWidth * 0.5 + this.getOutOfBounds())
                }

                if (['all', 'vertical'].includes(direction)) {
                  const nextY = this.positionY + e.offsetY * this.getScale()
                  this.y = calcPosition(nextY, incrementHeight * 0.5 - this.getOutOfBounds(), areaHeightEnd + incrementHeight * 0.5 + this.getOutOfBounds())
                }
              }).onActionEnd(() => {
                this.updatePosition()
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
          .gesture(
            GestureGroup(GestureMode.Parallel,
              PanGesture({}).onActionStart((e: GestureEvent) => {
                this.positionX = this.x
                this.positionY = this.y
              }).onActionUpdate((e: GestureEvent) => {
                if (!this.node || this.node.getAttribute('disabled')) return
                const direction = this.node.getAttribute('direction')

                // 容器的宽高终点
                const areaWidthEnd = Number(this.areaWidth) - Number(this.selfWidth) * this.getScale()
                const areaHeightEnd = Number(this.areaHeight) - Number(this.selfHeight) * this.getScale()

                // 缩放后的容器和原来容器的宽高差
                const incrementWidth = (this.getScale() - 1) * Number(this.selfWidth)
                const incrementHeight = (this.getScale() - 1) * Number(this.selfHeight)

                if (['all', 'horizontal'].includes(direction)) {
                  const nextX = this.positionX + e.offsetX * this.getScale()
                  this.x = calcPosition(nextX, incrementWidth * 0.5 - this.getOutOfBounds(), areaWidthEnd + incrementWidth * 0.5 + this.getOutOfBounds())
                }

                if (['all', 'vertical'].includes(direction)) {
                  const nextY = this.positionY + e.offsetY * this.getScale()
                  this.y = calcPosition(nextY, incrementHeight * 0.5 - this.getOutOfBounds(), areaHeightEnd + incrementHeight * 0.5 + this.getOutOfBounds())
                }
              }).onActionEnd(() => {
                this.updatePosition()
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
      .scale({ x: this.getScale(), y: this.getScale() })
      .onAreaChange((oldValue: Area, newValue: Area) => {
        this.selfWidth = newValue.width
        this.selfHeight = newValue.height
      })

    }
  }
}
