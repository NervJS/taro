import { TaroElement } from './element'

import type { MovableViewProps } from '@tarojs/components/types'

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

@Observed
export class TaroMovableViewElement extends TaroElement<MovableViewProps & { animation: undefined }> {
  _scaleValue = 1
  _scalevalueTemp = 1

  // 父级区别的大小
  _area?: Tsize
  // 自己元素的大小
  _selfSize?: Tsize

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

  startScale() {
    this._scalevalueTemp = this._scaleValue
  }

  set scaleValue(val: number) {
    const scale = this.getAttribute('scale')

    // 禁止缩放的时候不生效
    if (scale) {
      this._scaleValue = this.checkScaleBoundary(val * this._scalevalueTemp)
      this.checkPositionBoundary(this.position, val * this._scalevalueTemp)
    }
  }

  get scaleValue() {
    return this._scaleValue
  }

  set area(val: Tsize) {
    this._area = val
  }

  get area(): Tsize | undefined {
    return this._area
  }

  get position() {
    return this._position
  }

  set position(val: Tpoint) {
    this._position = val
  }

  set selfSize(val: Tsize) {
    this._selfSize = val
  }

  get selfSize(): Tsize | undefined {
    return this._selfSize
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

  checkScaleBoundary(currentScale) {
    const scaleMin = this.getAttribute('scaleMin')
    const scaleMax = this.getAttribute('scaleMax')

    if (scaleMin && Number(scaleMin) >= 0.1 && currentScale < Number(scaleMin)) {
      return Number(scaleMin)
    } else if (scaleMax && Number(scaleMax) >= 0.1 && currentScale > Number(scaleMax)) {
      return Number(scaleMax)
    } else {
      return currentScale
    }
  }
}
