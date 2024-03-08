import { eventSource, TaroAny, TaroNode } from '@tarojs/runtime'

import { TaroElement } from './element'

import type { CanvasProps, CanvasTouchEvent } from '@tarojs/components/types'

// class TaroCanvasContext2D {
//   harmonyContext2D: CanvasRenderingContext2D

//   constructor(ctx2D: CanvasRenderingContext2D) {
//     this.harmonyContext2D = ctx2D
//   }

//   arc(...args: Parameters<typeof this.harmonyContext2D.arc>) {
//     this.harmonyContext2D.arc(...args)
//   }

//   arcTo(...args: Parameters<typeof this.harmonyContext2D.arcTo>) {
//     this.harmonyContext2D.arcTo(...args)
//   }

//   beginPath(...args: Parameters<typeof this.harmonyContext2D.beginPath>) {
//     this.harmonyContext2D.beginPath(...args)
//   }

//   bezierCurveTo(...args: Parameters<typeof this.harmonyContext2D.bezierCurveTo>) {
//     this.harmonyContext2D.bezierCurveTo(...args)
//   }

//   clearRect(...args: Parameters<typeof this.harmonyContext2D.clearRect>) {
//     this.harmonyContext2D.clearRect(...args)
//   }

//   clip(...args: Parameters<typeof this.harmonyContext2D.clip>) {
//     this.harmonyContext2D.clip(...args)
//   }

//   closePath(...args: Parameters<typeof this.harmonyContext2D.closePath>) {
//     this.harmonyContext2D.closePath(...args)
//   }

//   createLinearGradient(...args: Parameters<typeof this.harmonyContext2D.createLinearGradient>) {
//     this.harmonyContext2D.createLinearGradient(...args)
//   }

//   createPattern(...args: Parameters<typeof this.harmonyContext2D.createPattern>) {
//     this.harmonyContext2D.createPattern(...args)
//   }

//   drawImage(...args: Parameters<typeof this.harmonyContext2D.drawImage>) {
//     this.harmonyContext2D.drawImage(...args)
//   }

//   fill(...args: Parameters<typeof this.harmonyContext2D.fill>) {
//     this.harmonyContext2D.fill(...args)
//   }

//   fillRect(...args: Parameters<typeof this.harmonyContext2D.fillRect>) {
//     this.harmonyContext2D.fillRect(...args)
//   }

//   fillText(...args: Parameters<typeof this.harmonyContext2D.fillText>) {
//     this.harmonyContext2D.fillText(...args)
//   }

//   lineTo(...args: Parameters<typeof this.harmonyContext2D.lineTo>) {
//     this.harmonyContext2D.lineTo(...args)
//   }

//   measureText(...args: Parameters<typeof this.harmonyContext2D.measureText>) {
//     this.harmonyContext2D.measureText(...args)
//   }

//   moveTo(...args: Parameters<typeof this.harmonyContext2D.moveTo>) {
//     this.harmonyContext2D.moveTo(...args)
//   }

//   quadraticCurveTo(...args: Parameters<typeof this.harmonyContext2D.quadraticCurveTo>) {
//     this.harmonyContext2D.quadraticCurveTo(...args)
//   }

//   rect(...args: Parameters<typeof this.harmonyContext2D.rect>) {
//     this.harmonyContext2D.rect(...args)
//   }

//   restore(...args: Parameters<typeof this.harmonyContext2D.restore>) {
//     this.harmonyContext2D.restore(...args)
//   }

//   rotate(...args: Parameters<typeof this.harmonyContext2D.rotate>) {
//     this.harmonyContext2D.rotate(...args)
//   }

//   save(...args: Parameters<typeof this.harmonyContext2D.save>) {
//     this.harmonyContext2D.save(...args)
//   }

//   scale(...args: Parameters<typeof this.harmonyContext2D.scale>) {
//     this.harmonyContext2D.scale(...args)
//   }

//   setTransform(...args: Parameters<typeof this.harmonyContext2D.setTransform>) {
//     this.harmonyContext2D.setTransform(...args)
//   }

//   stroke(...args: Parameters<typeof this.harmonyContext2D.stroke>) {
//     this.harmonyContext2D.stroke(...args)
//   }

//   strokeRect(...args: Parameters<typeof this.harmonyContext2D.strokeRect>) {
//     this.harmonyContext2D.strokeRect(...args)
//   }

//   strokeText(...args: Parameters<typeof this.harmonyContext2D.strokeText>) {
//     this.harmonyContext2D.strokeText(...args)
//   }

//   transform(...args: Parameters<typeof this.harmonyContext2D.transform>) {
//     this.harmonyContext2D.transform(...args)
//   }

//   translate(...args: Parameters<typeof this.harmonyContext2D.translate>) {
//     this.harmonyContext2D.translate(...args)
//   }

//   createCircularGradient() {
//     // Not supported now
//   }

//   draw() {
//     // Not supported now
//   }

//   setFillStyle(fillStyle: typeof this.harmonyContext2D.fillStyle) {
//     this.harmonyContext2D.fillStyle = fillStyle
//   }

//   setFontSize(fontSize: number) {
//     const font = this.harmonyContext2D.font.split(' ')
//     font[2] = `${fontSize}`
//     this.harmonyContext2D.font = font.join(' ')
//   }

//   setGlobalAlpha(globalAlpha: typeof this.harmonyContext2D.globalAlpha) {
//     this.harmonyContext2D.globalAlpha = globalAlpha
//   }

//   setLineCap(lineCap: typeof this.harmonyContext2D.lineCap) {
//     this.harmonyContext2D.lineCap = lineCap
//   }

//   setLineDash(...args: Parameters<typeof this.harmonyContext2D.setLineDash>) {
//     this.harmonyContext2D.setLineDash(...args)
//   }

//   setLineJoin(lineJoin: typeof this.harmonyContext2D.lineJoin) {
//     this.harmonyContext2D.lineJoin = lineJoin
//   }

//   setLineWidth(lineWidth: typeof this.harmonyContext2D.lineWidth) {
//     this.harmonyContext2D.lineWidth = lineWidth
//   }

//   setMiterLimit(miterLimit: typeof this.harmonyContext2D.miterLimit) {
//     this.harmonyContext2D.miterLimit = miterLimit
//   }

//   setShadow(offsetX: number, offsetY: number, blur: number, color: string) {
//     this.harmonyContext2D.shadowOffsetX = offsetX
//     this.harmonyContext2D.shadowOffsetY = offsetY
//     this.harmonyContext2D.shadowBlur = blur
//     this.harmonyContext2D.shadowColor = color
//   }

//   setStrokeStyle(strokeStyle: typeof this.harmonyContext2D.strokeStyle) {
//     this.harmonyContext2D.strokeStyle = strokeStyle
//   }

//   setTextAlign(textAlign: typeof this.harmonyContext2D.textAlign) {
//     this.harmonyContext2D.textAlign = textAlign
//   }

//   setTextBaseline(textBaseline: typeof this.harmonyContext2D.textBaseline) {
//     this.harmonyContext2D.textBaseline = textBaseline
//   }
// }

class CanvasRenderingContext2DWXAdapter extends CanvasRenderingContext2D {
  constructor(settings?: RenderingContextSetting) {
    super(settings)
  }

  createCircularGradient() {
    // Not supported now
  }

  draw() {
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

@Observed
export class TaroCanvasElement extends TaroElement<CanvasProps, CanvasTouchEvent> {
  settings: RenderingContextSettings
  context: CanvasRenderingContext2D

  constructor() {
    super('Canvas')
    this.settings = new RenderingContextSettings(true)
    this.context = new CanvasRenderingContext2DWXAdapter(this.settings) as CanvasRenderingContext2D
  }

  public setAttribute(name: string, value: TaroAny): void {
    if (name === 'canvasId') {
      eventSource.set(value, this as TaroNode)
    }
    super.setAttribute(name, value)
  }
}
