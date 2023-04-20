import { Component, h, ComponentInterface, Prop, Host, Method, State, Listen } from '@stencil/core'

import {
  TOP,
  LINE_HEIGHT,
  MASK_HEIGHT
} from './constant'

@Component({
  tag: 'taro-picker-group'
})
export class TaroPickerGroup implements ComponentInterface {
  @Prop() mode: 'time' | 'date'
  @Prop() range: any[] = []
  @Prop() rangeKey: string
  @Prop() height: number
  @Prop() columnId: string
  @Prop() updateHeight: (height: number, columnId: string, needRevise?: boolean) => void
  // FIXME Please use the "@Event()" decorator to expose events instead, not properties or methods.
  @Prop() onColumnChange: (height: number, columnId: string) => void
  @Prop() updateDay: (value: number, fields: number) => void

  @State() startY: number
  @State() preY: number
  @State() hadMove: boolean
  @State() touchEnd: boolean
  @State() isMove: boolean

  getPosition () {
    const transition = this.touchEnd ? 0.3 : 0
    const transformValue = `translate3d(0, ${this.height}px, 0)`
    const transitionValue = `transform ${transition}s`
    return {
      transform: transformValue,
      '-webkit-transform': transformValue,
      transition: transitionValue,
      '-webkit-transition': transitionValue
    }
  }

  formulaUnlimitedScroll (range: number, absoluteHeight: number, direction: 'up' | 'down') {
    const { height, updateHeight, columnId } = this
    const factor = direction === 'up' ? 1 : -1

    this.touchEnd = false

    // 点击超过范围，点击到补帧时，先跳到另一端的补帧
    updateHeight(-range * factor * LINE_HEIGHT + height, columnId)

    // 再做过渡动画
    requestAnimationFrame(() => {
      this.touchEnd = true
      const index = Math.round(absoluteHeight / -LINE_HEIGHT) + range * factor
      const relativeHeight = TOP - LINE_HEIGHT * index
      updateHeight(relativeHeight, columnId, true)
    })
  }

  @Method()
  async handleMoveStart (clientY: number) {
    // 记录第一次的点击位置
    this.startY = clientY
    this.preY = clientY
    this.hadMove = false
  }

  @Method()
  async handleMoving (clientY: number) {
    const y = clientY
    const deltaY = y - this.preY
    this.preY = y
    this.touchEnd = false

    if (Math.abs(y - this.startY) > 10) this.hadMove = true

    let newPos = this.height + deltaY

    // 处理时间选择器的无限滚动
    if (this.mode === 'time') {
      if (this.columnId === '0') {
        // 数字 28 来自于 4 格补帧 + 0 ～ 23 的 24 格，共 28 格
        if (newPos > TOP - LINE_HEIGHT * 3) {
          newPos = TOP - LINE_HEIGHT * 27 + deltaY
        }
        if (newPos < TOP - LINE_HEIGHT * 28) {
          newPos = TOP - LINE_HEIGHT * 4 + deltaY
        }
      } else if (this.columnId === '1') {
        if (newPos > TOP - LINE_HEIGHT * 3) {
          newPos = TOP - LINE_HEIGHT * 63 + deltaY
        }
        if (newPos < TOP - LINE_HEIGHT * 64) {
          newPos = TOP - LINE_HEIGHT * 4 + deltaY
        }
      }
    }

    this.updateHeight(newPos, this.columnId)
  }

  @Method()
  async handleMoveEnd (clientY: number) {
    const {
      mode,
      range,
      height,
      updateHeight,
      onColumnChange,
      columnId
    } = this
    const max = 0
    const min = -LINE_HEIGHT * (range.length - 1)
    const endY = clientY

    this.touchEnd = true

    // touchEnd 时的高度，可能带小数点，需要再处理
    let absoluteHeight: number

    if (!this.hadMove) {
      /** 点击 */
      // 屏幕高度
      const windowHeight = window.innerHeight
      // picker__mask 垂直方向距离屏幕顶部的高度
      const relativeY = windowHeight - MASK_HEIGHT / 2

      absoluteHeight = height - TOP - (endY - relativeY)

      // 处理时间选择器的无限滚动
      if (mode === 'time') {
        if (columnId === '0') {
          // 点击上溢出
          // absoluteHeight 是相对模块中点来算的，所以会算多半行，这时要减去这半行，即2.5行
          if (absoluteHeight > -LINE_HEIGHT * 2.5) {
            return this.formulaUnlimitedScroll(24, absoluteHeight, 'up')
          }
          // 点击下溢出
          if (absoluteHeight < -LINE_HEIGHT * 28.5) {
            return this.formulaUnlimitedScroll(24, absoluteHeight, 'down')
          }
        } else if (columnId === '1') {
          // 点击上溢出
          if (absoluteHeight > -LINE_HEIGHT * 2.5) {
            return this.formulaUnlimitedScroll(60, absoluteHeight, 'up')
          }
          // 点击下溢出
          if (absoluteHeight < -LINE_HEIGHT * 64.5) {
            return this.formulaUnlimitedScroll(60, absoluteHeight, 'down')
          }
        }
      }
    } else {
      /** 滚动 */
      absoluteHeight = height - TOP
    }

    // 边界情况处理
    if (absoluteHeight > max) absoluteHeight = 0
    if (absoluteHeight < min) absoluteHeight = min

    // 先按公式算出 index, 再用此 index 算出一个整数高度
    const index = Math.round(absoluteHeight / -LINE_HEIGHT)
    const relativeHeight = TOP - LINE_HEIGHT * index

    if (this.mode === 'date') {
      if (this.columnId === '0') {
        this.updateDay(
          +this.range[index].replace(/[^0-9]/gi, ''),
          0
        )
      }
      if (this.columnId === '1') {
        this.updateDay(
          +this.range[index].replace(/[^0-9]/gi, ''),
          1
        )
      }
      if (this.columnId === '2') {
        this.updateDay(
          +this.range[index].replace(/[^0-9]/gi, ''),
          2
        )
      }
    }

    updateHeight(relativeHeight, columnId, mode === 'time')
    onColumnChange && onColumnChange(relativeHeight, columnId)
  }

  @Listen('mousedown')
  onMouseDown (e: MouseEvent) {
    this.isMove = true
    this.handleMoveStart(e.clientY)
  }

  @Listen('mousemove')
  onMouseMove (e: MouseEvent) {
    e.preventDefault()

    if (!this.isMove) return

    this.handleMoving(e.clientY)
  }

  @Listen('mouseup')
  @Listen('mouseleave')
  onMouseMoveEnd (e: MouseEvent) {
    if (!this.isMove) return

    this.isMove = false
    this.handleMoveEnd(e.clientY)
  }

  @Listen('touchstart')
  onTouchStart (e: TouchEvent) {
    this.handleMoveStart(e.changedTouches[0].clientY)
  }

  @Listen('touchmove')
  onTouchMove (e: TouchEvent) {
    e.preventDefault()

    this.handleMoving(e.changedTouches[0].clientY)
  }

  @Listen('touchend')
  onTouchEnd (e: TouchEvent) {
    this.handleMoveEnd(e.changedTouches[0].clientY)
  }

  render () {
    const { range, rangeKey } = this
    const pickerItem = range.map(item => {
      const content = rangeKey ? item[rangeKey] : item
      return (
        <div class='weui-picker__item'>{content}</div>
      )
    })

    return (
      <Host class='weui-picker__group'>
        <div class='weui-picker__mask' />
        <div class='weui-picker__indicator' />
        <div class='weui-picker__content' style={this.getPosition()}>
          {pickerItem}
        </div>
      </Host>
    )
  }
}
