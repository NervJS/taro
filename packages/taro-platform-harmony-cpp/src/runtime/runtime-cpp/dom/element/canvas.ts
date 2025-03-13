import { TaroElement } from './element'

import type { CanvasProps, CanvasTouchEvent } from '@tarojs/components/types'
import type Taro from '@tarojs/taro/types'

class TaroCanvasContext {
  type = '2d'
  element: TaroCanvasElement

  private font_ = ''

  setStrokeStyle(color: string): void {
    nativeUIManager.executeNodeFunc(this.element, 'setStrokeStyle', color)
  }

  setLineWidth(lineWidth: number): void {
    nativeUIManager.executeNodeFunc(this.element, 'setLineWidth', lineWidth)
  }

  rect(x: number, y: number, width: number, height: number): void {
    nativeUIManager.executeNodeFunc(this.element, 'rect', [x, y, width, height])
  }

  draw(): Promise<void> {
    return new Promise((resolve, reject) => {
      nativeUIManager.executeNodeFunc(this.element, 'draw', [resolve, reject])
    })
  }

  stroke(): void {
    nativeUIManager.executeNodeFunc(this.element, 'stroke', null)
  }

  moveTo(x: number, y: number): void {
    nativeUIManager.executeNodeFunc(this.element, 'moveTo', [x, y])
  }

  arc(x: number, y: number, r: number, sAngle: number, eAngle: number, counterclockwise = false): void {
    nativeUIManager.executeNodeFunc(this.element, 'arc', [x, y, r, sAngle, eAngle, counterclockwise])
  }

  lineTo(x: number, y: number): void {
    nativeUIManager.executeNodeFunc(this.element, 'lineTo', [x, y])
  }

  setFontSize(fontSize: number): void {
    nativeUIManager.executeNodeFunc(this.element, 'setFontSize', fontSize)
  }

  setTextAlign(textAlign: string): void {
    nativeUIManager.executeNodeFunc(this.element, 'setTextAlign', textAlign)
  }

  fillText(text: string, x: number, y: number): void {
    nativeUIManager.executeNodeFunc(this.element, 'fillText', [text, x, y])
  }

  fillRect(x: number, y: number, width: number, height: number): void {
    nativeUIManager.executeNodeFunc(this.element, 'fillRect', [x, y, width, height])
  }

  strokeRect(x: number, y: number, width: number, height: number): void {
    nativeUIManager.executeNodeFunc(this.element, 'strokeRect', [x, y, width, height])
  }

  fill(): void {
    nativeUIManager.executeNodeFunc(this.element, 'fill', null)
  }

  setFillStyle(color: string): void {
    nativeUIManager.executeNodeFunc(this.element, 'setFillStyle', color)
  }

  beginPath(): void {
    nativeUIManager.executeNodeFunc(this.element, 'beginPath', null)
  }

  closePath(): void {
    nativeUIManager.executeNodeFunc(this.element, 'closePath', null)
  }

  translate(x: number, y: number): void {
    nativeUIManager.executeNodeFunc(this.element, 'translate', [x, y])
  }

  rotate(rotate: number): void {
    nativeUIManager.executeNodeFunc(this.element, 'rotate', rotate)
  }

  scale(scaleWidth: number, scaleHeight: number): void {
    nativeUIManager.executeNodeFunc(this.element, 'scale', [scaleWidth, scaleHeight])
  }

  get font () {
    return this.font_
  }

  set font(value: string) {
    this.font_ = value
    nativeUIManager.executeNodeFunc(this.element, 'font', this.font_)
  }

  // @ts-ignore
  measureText(text: string): { width: number } {
    return {
      width: nativeUIManager.executeNodeFunc(this.element, 'measure', text)
    }
  }

  drawImage(...args): { width: number } {
    // 解构参数
    const [imageResource, ...rest] = args
    let src = imageResource
    if (imageResource instanceof TaroCanvasImage) {
      src = imageResource.src
    }
    switch (rest.length) {
      case 2: {
        const [dx, dy] = rest
        return this.drawSimple(src, dx, dy)
      }
      case 3:
      case 4: {
        const [dx2, dy2, dWidth, dHeight] = rest
        return this.drawWithSize(src, dx2, dy2, dWidth, dHeight)
      }
      case 8: {
        const [sx, sy, sWidth, sHeight, dx3, dy3, dWidth2, dHeight2] = rest
        return this.drawWithCrop(src, sx, sy, sWidth, sHeight, dx3, dy3, dWidth2, dHeight2)
      }
      default:
        throw new Error('Invalid number of arguments')
    }
  }

  private drawSimple(src, dx, dy) {
    return {
      width: nativeUIManager.executeNodeFunc(this.element, 'drawImage', {
        src, dx, dy
      })
    }
  }

  private drawWithSize(src, dx, dy, dWidth, dHeight) {
    return {
      width: nativeUIManager.executeNodeFunc(this.element, 'drawImage', {
        src, dx, dy, dWidth, dHeight
      })
    }
  }

  private drawWithCrop(src, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
    return {
      width: nativeUIManager.executeNodeFunc(this.element, 'drawImage', {
        src, dx, dy, dWidth, dHeight, sx, sy, sWidth, sHeight
      })
    }
  }

  reset(): void {
    nativeUIManager.executeNodeFunc(this.element, 'reset', null)
  }
}

class TaroCanvasImage {
  constructor(id: number) {
    this._nid = id
  }

  _nid: number
  width: number
  height: number
  onload: () => void
  onerror: () => void

  private _src = ''

  get src () {
    return this._src
  }

  set src (val: string) {
    this._src = val

    nativeOtherManager.loadImage(this._nid, val, (width, height) => {
      this.width = width
      this.height = height
      if (typeof this.onload === 'function') {
        this.onload()
      }
    }, () => {
      if (typeof this.onerror === 'function') {
        this.onerror()
      }
    })
  }
}

export class TaroCanvasElement extends TaroElement<CanvasProps, CanvasTouchEvent> {
  constructor() {
    super('Canvas')
  }

  getContext(_type = '2d') {
    const canvasContext = new TaroCanvasContext()
    canvasContext.element = this
    return canvasContext
  }

  createImage() {
    return new TaroCanvasImage(this._nid)
  }

  toDataURL(type: string): string {
    return this.exportDataUrl({
      fileType: type as unknown as keyof Taro.canvasToTempFilePath.FileType
    })
  }

  exportDataUrl(opts: Taro.canvasToTempFilePath.Option): string {
    return nativeUIManager.executeNodeFunc(this, 'toDataUrl', opts)
  }

  exportDataUrlAsync(opts: Taro.canvasToTempFilePath.Option): Promise<string> {
    return nativeUIManager.executeNodeFunc(this, 'toDataUrlAsync', opts)
  }
}
