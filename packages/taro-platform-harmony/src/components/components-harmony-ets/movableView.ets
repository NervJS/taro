import type { TaroMovableViewElement, TaroStyleType, TaroAny } from '@tarojs/runtime'

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
  @ObjectLink @Watch('onNodeUpdate') node: TaroMovableViewElement
  // 元素自身的宽高，用于计算边界
  selfWidth: Length = 0
  selfHeight: Length = 0
  // position用于记录拖动刚开始时，元素的x和y，position加上拖动手势返回的拖动距离得到最新的元素位置
  positionX: number = 0
  positionY: number = 0
  // 直接用于设置元素的位置
  @State x: number = 0
  @State y: number = 0
  // 父容器的宽高，用于计算边界
  @Consume areaWidth: Length
  @Consume areaHeight: Length
  // pinchValue是元素缩放的起始值，跟手势事件返回的缩放比例相乘得到最新缩放比例
  pinchValue: number = 1
  // selfScaleValue 是自身缩放手势积累的缩放比例，scaleValue父容易的缩放手势累积的缩放比例，
  // selfScaleValue * scaleValue为元素的最终比例，一部分由this.getScale()处理返回
  @State @Watch('onScaleUpdated') selfScaleValue: number = 1
  @Consume @Watch('onScaleUpdated') scaleValue: number
  // proptemp用于记录props值上次更新的值，当node触发更新的时候进行比较
  proptempX: number = 0
  proptempY: number = 0
  proptempScaleValue: number = 1
  proptempScale: Boolean = false

  keepScale: number = 1

  aboutToAppear() {
    this.onNodeUpdate()
  }

  onNodeUpdate() {
    const propX = parseFloat(this.node.getAttribute('x'))
    const propY = parseFloat(this.node.getAttribute('y'))
    const scale = this.node.getAttribute('scale')
    const scaleValue = !isNaN(parseFloat(this.node.getAttribute('scaleValue'))) ? parseFloat(this.node.getAttribute('scaleValue')) : 1

    if (this.proptempX !== propX) {
      this.x = propX
      this.proptempX = propX
    }

    if (this.proptempY !== propY) {
      this.y = propY
      this.proptempY = propY
    }

    if (this.proptempScaleValue !== scaleValue) {
      this.selfScaleValue = scaleValue
      this.proptempScaleValue = scaleValue
    }

    if(!scale) {
      this.keepScale = this.getScale()
      this.proptempScale = false
    } else if (scale && this.proptempScale === false) {
      this.selfScaleValue = this.keepScale / this.scaleValue
      this.proptempScale = true
    }
    this.updatePosition()

  }

  onScaleUpdated(propName: string) {
    const scaleMin = this.node.getAttribute('scaleMin')
    const scaleMax = this.node.getAttribute('scaleMax')
    const scale = this.node.getAttribute('scale')


    if (propName === 'scaleValue') {
      if (scaleMin && Number(scaleMin) >= 0.1 && this.getScale() < Number(scaleMin)) {
        this.selfScaleValue = Number(scaleMin) / this.scaleValue
      } else if (scaleMax && Number(scaleMax) >= 0.1 && this.getScale() > Number(scaleMax)) {
        this.selfScaleValue = Number(scaleMax) / this.scaleValue
      } else {
        this.updatePosition()
      }
    }

    if (propName === 'selfScaleValue') {
      if (scaleMin && Number(scaleMin) >= 0.1 && this.getScale() < Number(scaleMin)) {
        this.scaleValue = Number(scaleMin) / this.selfScaleValue
      } else if (scaleMax && Number(scaleMax) >= 0.1 && this.getScale() > Number(scaleMax)) {
        this.scaleValue = Number(scaleMax) / this.selfScaleValue
      } else {
        this.updatePosition()
      }
    }

    const bindscale = this.node.getAttribute('bindscale')
    if (typeof bindscale === 'function') {
      (bindscale as (...arg: TaroAny) => TaroAny)({ x: this.x, y: this.y, source: 'touch' })
    }


  }

  getOutOfBounds() {
    if (this.node.getAttribute('outOfBounds')) {
      return Number(this.selfWidth) / 3
    }
    return 0
  }

  getScale() {
    if(!this.proptempScale) return this.keepScale

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
        } else {
          Column() {
            createLazyChildren(this.node)
          }
          .attributeModifier(commonStyleModify.setNode(this.node))
          .columnAttrs(getNormalAttributes(this.node))
          .alignItems(FlexManager.flexOptions(this.node).alignItems as HorizontalAlign)
          .justifyContent(FlexManager.flexOptions(this.node).justifyContent)
        }
        Text(`${this.node?.area?.w}`).fontSize(20)
      }
      .translate({ x: this.x, y: this.y })
      .scale({ x: this.getScale(), y: this.getScale() })
      .onAreaChange((oldValue: Area, newValue: Area) => {
        this.selfWidth = newValue.width
        this.selfHeight = newValue.height



        this.node.selfSize = {w: Number(newValue.width), h: Number(newValue.height)}
      })
      .gesture(
        GestureGroup(GestureMode.Parallel,
          PanGesture({fingers:1}).onActionStart((e: GestureEvent) => {
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

            // 事件处理
            const bindchange = this.node.getAttribute('bindchange')
            if (typeof bindchange === 'function') {
              (bindchange as (...arg: TaroAny) => TaroAny)({ x: this.x, y: this.y, source: 'touch' })
            }

          }).onActionEnd(() => {
            this.updatePosition()
          }),
          PinchGesture({ fingers: 2 }).onActionStart((event: GestureEvent) => {
            console.info('movableArea::Pinch start 2');
            this.pinchValue = this.selfScaleValue



            this.node.startScale()
          }).onActionUpdate((event) => {
            if(!this.node.getAttribute('scale')) return
            this.selfScaleValue = this.pinchValue * event.scale;
            console.info('movableArea::update2', this.selfScaleValue)


            this.scaleValue = event.scale
          })
        )
      )
    }
  }
}
