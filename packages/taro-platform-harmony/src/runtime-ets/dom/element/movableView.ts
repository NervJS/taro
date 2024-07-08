import { TaroElement } from './element'

import type { MovableViewProps } from '@tarojs/components/types'
import type { TaroAny } from '../../utils'

type Tsize = {
  w: number
  h: number
}
type Tpoint = {
  x: number
  y: number
}

function calcPosition(postion: number, start: number, end: number) {
  if (postion <= end && postion >= start) {
    return postion
  } else if (postion < start) {
    return start
  } else {
    return end
  }
}

export function isTaroMovableViewElement (item: TaroAny): item is TaroMovableViewElement {
  return item instanceof TaroMovableViewElement
}
@Observed
export class TaroMovableViewElement extends TaroElement<MovableViewProps & { animation: undefined }> {
  _scaleValue = 1
  _scalevalueTemp = 1

  // 父级区别的大小
  _area?: Tsize
  // 自己元素的大小
  _selfSize?: Tsize
  _areaInited: false
  _selfSizeInited: false

  // 元素的位置
  _position: Tpoint = {
    x: 0,
    y: 0,
  }

  _positionTemp: Tpoint = {
    x: 0,
    y: 0,
  }

  constructor() {
    super('MovableView')
  }

  get _outOfBounds() {
    if (this.getAttribute('outOfBounds')) {
      return this.selfSize ? this.selfSize.w / 3 : 0
    }
    return 0
  }

  startScale() {
    this._scalevalueTemp = this._scaleValue
  }

  doScale(val: number) {
    const scale = this.getAttribute('scale')

    // 禁止缩放的时候不生效
    if (scale) {
      this.scaleValue = val * this._scalevalueTemp
    }
  }

  set scaleValue(val: number) {
    if (this.checkScaleValueInBounds(val)) {
      this._scaleValue = val

      this.checkPositionBoundary(this.position, val)

      const scaleFns = this?.__listeners?.scale || []
      scaleFns.forEach((fn) => {
        fn({ ...this.position, scale: this.scaleValue })
      })
    }
  }

  get visibility () {
    return this._areaInited && this._selfSizeInited ? Visibility.Visible : Visibility.Hidden
  }

  get scaleValue() {
    return this._scaleValue
  }

  startMove() {
    this._positionTemp = this._position
  }

  doMove(val: Tpoint) {
    if (!this.area || !this.selfSize) {
      return
    }
    if (this.getAttribute('disabled')) {
      return
    }
    const direction = this.getAttribute('direction')

    // 容器的宽高终点
    const areaWidthEnd = this.area.w - this.selfSize.w * this.scaleValue
    const areaHeightEnd = this.area.h - this.selfSize.h * this.scaleValue

    const incrementWidth = (this.scaleValue - 1) * this.selfSize.w
    const incrementHeight = (this.scaleValue - 1) * this.selfSize.h

    let x = this._positionTemp.x
    let y = this._positionTemp.y
    if (['all', 'horizontal'].includes(direction)) {
      const nextX = this._positionTemp.x + val.x * this.scaleValue
      x = calcPosition(
        nextX,
        incrementWidth * 0.5 - this._outOfBounds,
        areaWidthEnd + incrementWidth * 0.5 + this._outOfBounds
      )
    }

    if (['all', 'vertical'].includes(direction)) {
      const nextY = this._positionTemp.y + val.y * this.scaleValue
      y = calcPosition(
        nextY,
        incrementHeight * 0.5 - this._outOfBounds,
        areaHeightEnd + incrementHeight * 0.5 + this._outOfBounds
      )
    }

    const changeFns = this?.__listeners?.change || []
    changeFns.forEach((fn) => {
      fn({ x, y, source: 'touch' })
    })

    this.position = {
      x: x,
      y: y,
    }
  }

  get position() {
    return this._position
  }

  set position(val: Tpoint) {
    this._position = val
  }

  set area(val: Tsize) {
    if (val.w === this._area?.w && val.h === this._area?.h) return
    this._area = val
    if (!this._areaInited) {
      this._areaInited = true
      this.initPositionFromAttribute()
    }
  }

  get area(): Tsize | undefined {
    return this._area
  }

  set selfSize(val: Tsize) {
    if (val.w === this._selfSize?.w && val.h === this._selfSize?.h) return
    this._selfSize = val
    if (!this._selfSizeInited) {
      this._selfSizeInited = true
      this.initPositionFromAttribute()
    }
  }

  get selfSize(): Tsize | undefined {
    return this._selfSize
  }

  initPositionFromAttribute () {
    if (!this.area || !this.selfSize) {
      return
    }
    const x = this.getAttribute('x') ? Number(this.getAttribute('x')) : 0
    const y = this.getAttribute('y') ? Number(this.getAttribute('y')) : 0
    this.checkPositionBoundary({ x, y }, this.scaleValue)
  }

  checkPositionBoundary(position: Tpoint, scale: number) {
    if (!this.area || !this.selfSize) {
      return { x: 0, y: 0 }
    }

    const areaWidthEnd = this.area.w - this.selfSize.w * scale
    const areaHeightEnd = this.area.h - this.selfSize.h * scale

    const incrementWidth = (scale - 1) * this.selfSize.w
    const incrementHeight = (scale - 1) * this.selfSize.h

    this.position = {
      x: calcPosition(position.x, incrementWidth * 0.5, areaWidthEnd + incrementWidth * 0.5),
      y: calcPosition(position.y, incrementHeight * 0.5, areaHeightEnd + incrementHeight * 0.5),
    }
  }

  checkScaleValueInBounds(currentScale: number) {
    const scaleMin = this.getAttribute('scaleMin')
    const scaleMax = this.getAttribute('scaleMax')

    if (scaleMin && Number(scaleMin) >= 0.1 && currentScale < Number(scaleMin)) {
      return false
    } else if (scaleMax && Number(scaleMax) >= 0.1 && currentScale > Number(scaleMax)) {
      return false
    }

    return true
  }

  public setAttribute(name: string, value: any): void {
    if (name === 'x') {
      this.checkPositionBoundary({ x: value, y: this.position.y }, this.scaleValue)
    }
    if (name === 'y') {
      this.checkPositionBoundary({ x: this.position.x, y: value }, this.scaleValue)
    }

    super.setAttribute(name, value)
  }

  public callTouchEventFnFromGesture(eventName: string, gestureEvent: GestureEvent) {
    const touchFns = (this?.__listeners?.[eventName] || []) as Function[]
    touchFns.forEach(fn => {
      try {
        fn({
          _hmEvent: gestureEvent,
          target: this,
          changedTouches: gestureEvent.fingerList.map(finger => ({
            clientX: finger.globalX,
            clientY: finger.globalY
          }))
        })
      } catch (error) {
        console.error(error)
      }
    })
  }
}
