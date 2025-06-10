import { eventSource } from '../event-source'
import { TaroNode } from '../node'
import { TaroElement } from './element'

import type { CanvasProps, CanvasTouchEvent } from '@tarojs/components/types'
import type { TaroAny } from '../../interface'

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
function getContextKey(obj) {
  let currentObj = obj
  let res = []
  while (currentObj) {
    if (currentObj instanceof CanvasRenderingContext2D) {
      res = [...res, ...Object.getOwnPropertyNames(currentObj)]
    }
    currentObj = Object.getPrototypeOf(currentObj)
  }
  return res
}

@Observed
export class TaroCanvasElement extends TaroElement<CanvasProps, CanvasTouchEvent> {
  _drawList: {
    key: string
    value: TaroAny
  }[] = []

  settings: RenderingContextSettings
  _context: CanvasRenderingContext2D
  _contextProxy: CanvasRenderingContext2D

  constructor() {
    super('Canvas')
    this.settings = new RenderingContextSettings(true)
    const context = new CanvasRenderingContext2DWXAdapter(this.settings) as CanvasRenderingContext2D
    this._context = context

    const proxyObj = getContextKey(context).reduce((obj, key) => {
      if (typeof context[key] === 'function') {
        obj[key] = new Proxy(context[key], {
          apply: (target, thisArg, argumentsList) => {
            this._drawList.push({
              key,
              value: argumentsList,
            })
          },
        })
      } else {
        obj[key] = context[key]
      }
      return obj
    }, {})

    this._contextProxy = new Proxy(proxyObj, {
      set: (_, property, value) => {
        this._drawList.push({
          key: property,
          value,
        })
        return true
      },
    })
  }

  get context() {
    return this._contextProxy
  }

  public setAttribute(name: string, value: TaroAny): void {
    if (name === 'canvasId') {
      eventSource.set(`canvasId-${value}`, this as TaroNode)
    }
    super.setAttribute(name, value)
  }
}
