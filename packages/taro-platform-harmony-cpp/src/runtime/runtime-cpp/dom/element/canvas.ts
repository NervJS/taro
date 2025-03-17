import { TaroNativeModule } from '../../harmony-library'
import { TaroElement } from './element'

import type { CanvasProps, CanvasTouchEvent } from '@tarojs/components/types'
import type Taro from '@tarojs/taro/types'

export class CanvasRenderingContext2DWXAdapter extends CanvasRenderingContext2D {
  // constructor(settings?: RenderingContextSetting) {
  //   super(settings)
  // }

  createCircularGradient() {
    // Not supported now
  }

  draw(cb?: (...args: any[]) => any) {
    typeof cb === 'function' && cb()
    // Not supported now
  }

  setFillStyle(fillStyle: typeof this.fillStyle) {
    this.fillStyle = fillStyle
  }

  setFontSize(fontSize: number) {
    const font = this.font.split(' ')
    font[2] = `${fontSize}`
    this.font = font.join(' ')
  }

  setGlobalAlpha(globalAlpha: typeof this.globalAlpha) {
    this.globalAlpha = globalAlpha
  }

  setLineCap(lineCap: typeof this.lineCap) {
    this.lineCap = lineCap
  }

  setLineJoin(lineJoin: typeof this.lineJoin) {
    this.lineJoin = lineJoin
  }

  setLineWidth(lineWidth: typeof this.lineWidth) {
    this.lineWidth = lineWidth
  }

  setMiterLimit(miterLimit: typeof this.miterLimit) {
    this.miterLimit = miterLimit
  }

  setShadow(offsetX: number, offsetY: number, blur: number, color: string) {
    this.shadowOffsetX = offsetX
    this.shadowOffsetY = offsetY
    this.shadowBlur = blur
    this.shadowColor = color
  }

  setStrokeStyle(strokeStyle: typeof this.strokeStyle) {
    this.strokeStyle = strokeStyle
  }

  setTextAlign(textAlign: typeof this.textAlign) {
    this.textAlign = textAlign
  }

  setTextBaseline(textBaseline: typeof this.textBaseline) {
    this.textBaseline = textBaseline
  }
}

class TaroCanvasContext {
  type = '2d'
  element: TaroCanvasElement

  private font_ = ''

  setStrokeStyle(color: string): void {
    TaroNativeModule.executeNodeFunc(this.element, 'setStrokeStyle', color)
  }

  setLineWidth(lineWidth: number): void {
    TaroNativeModule.executeNodeFunc(this.element, 'setLineWidth', lineWidth)
  }

  rect(x: number, y: number, width: number, height: number): void {
    TaroNativeModule.executeNodeFunc(this.element, 'rect', [x, y, width, height])
  }

  draw(): Promise<void> {
    return new Promise(resolve => {
      TaroNativeModule.executeNodeFunc(this.element, 'drawAble', () => {
        TaroNativeModule.executeNodeFunc(this.element, 'draw')
        resolve()
      })
    })
  }

  stroke(): void {
    TaroNativeModule.executeNodeFunc(this.element, 'stroke')
  }

  moveTo(x: number, y: number): void {
    TaroNativeModule.executeNodeFunc(this.element, 'moveTo', [x, y])
  }

  arc(x: number, y: number, r: number, sAngle: number, eAngle: number, counterclockwise = false): void {
    TaroNativeModule.executeNodeFunc(this.element, 'arc', [x, y, r, sAngle, eAngle, counterclockwise])
  }

  lineTo(x: number, y: number): void {
    TaroNativeModule.executeNodeFunc(this.element, 'lineTo', [x, y])
  }

  setFontSize(fontSize: number): void {
    TaroNativeModule.executeNodeFunc(this.element, 'setFontSize', fontSize)
  }

  setTextAlign(textAlign: string): void {
    TaroNativeModule.executeNodeFunc(this.element, 'setTextAlign', textAlign)
  }

  fillText(text: string, x: number, y: number): void {
    TaroNativeModule.executeNodeFunc(this.element, 'fillText', [text, x, y])
  }

  fillRect(x: number, y: number, width: number, height: number): void {
    TaroNativeModule.executeNodeFunc(this.element, 'fillRect', [x, y, width, height])
  }

  strokeRect(x: number, y: number, width: number, height: number): void {
    TaroNativeModule.executeNodeFunc(this.element, 'strokeRect', [x, y, width, height])
  }

  fill(): void {
    TaroNativeModule.executeNodeFunc(this.element, 'fill')
  }

  setFillStyle(color: string): void {
    TaroNativeModule.executeNodeFunc(this.element, 'setFillStyle', color)
  }

  beginPath(): void {
    TaroNativeModule.executeNodeFunc(this.element, 'beginPath')
  }

  closePath(): void {
    TaroNativeModule.executeNodeFunc(this.element, 'closePath')
  }

  translate(x: number, y: number): void {
    TaroNativeModule.executeNodeFunc(this.element, 'translate', [x, y])
  }

  rotate(rotate: number): void {
    TaroNativeModule.executeNodeFunc(this.element, 'rotate', rotate)
  }

  scale(scaleWidth: number, scaleHeight: number): void {
    TaroNativeModule.executeNodeFunc(this.element, 'scale', [scaleWidth, scaleHeight])
  }

  get font () {
    return this.font_
  }

  set font(value: string) {
    this.font_ = value
    TaroNativeModule.executeNodeFunc(this.element, 'font', this.font_)
  }

  measureText(text: string): { width: number } {
    return {
      width: TaroNativeModule.executeNodeFunc(this.element, 'measure', text)
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
      width: TaroNativeModule.executeNodeFunc(this.element, 'drawImage', {
        src, dx, dy
      })
    }
  }

  private drawWithSize(src, dx, dy, dWidth, dHeight) {
    return {
      width: TaroNativeModule.executeNodeFunc(this.element, 'drawImage', {
        src, dx, dy, dWidth, dHeight
      })
    }
  }

  private drawWithCrop(src, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
    return {
      width: TaroNativeModule.executeNodeFunc(this.element, 'drawImage', {
        src, dx, dy, dWidth, dHeight, sx, sy, sWidth, sHeight
      })
    }
  }

  reset(): void {
    TaroNativeModule.executeNodeFunc(this.element, 'reset')
  }
}

class TaroCanvasImage {
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

    TaroNativeModule.loadImage(val, (width, height) => {
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
    return new TaroCanvasImage()
  }

  toDataURL(type: string): string {
    return this.exportDataUrl({
      fileType: type as unknown as keyof Taro.canvasToTempFilePath.FileType
    })
  }

  exportDataUrl(opts: Taro.canvasToTempFilePath.Option): string {
    return TaroNativeModule.executeNodeFunc(this, 'toDataUrl', opts)
  }
}
