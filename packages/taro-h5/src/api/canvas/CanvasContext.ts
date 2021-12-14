import { CanvasGradient } from '@tarojs/api'

interface IAction {
  func: (...arr: any[]) => void
  args: any[]
}

const TextBaseLineMap: Record<keyof Taro.CanvasContext.textBaseline, CanvasTextBaseline> = {
  top: 'top',
  bottom: 'bottom',
  middle: 'middle',
  normal: 'alphabetic'
}

export class CanvasContext implements Taro.CanvasContext {
  __raw__: CanvasRenderingContext2D
  actions: IAction[] = []

  set ctx (e: CanvasRenderingContext2D) {
    this.__raw__ = e
  }

  get ctx () {
    return this.__raw__
  }

  canvas: HTMLCanvasElement

  protected emptyActions () {
    this.actions.length = 0
  }

  protected enqueueActions (func: IAction['func']) {
    return (...args) => {
      this.actions.push({
        func,
        args
      })
    }
  }

  set fillStyle (e) { this.enqueueActions(() => { this.ctx.fillStyle = e }) }
  get fillStyle () { return this.ctx.fillStyle as string }
  set font (e) { this.ctx.font = e }
  get font () { return this.ctx.font }
  set globalAlpha (e) { this.enqueueActions(() => { this.ctx.globalAlpha = e }) }
  get globalAlpha () { return this.ctx.globalAlpha }
  set globalCompositeOperation (e) { this.enqueueActions(() => { this.ctx.globalCompositeOperation = e }) }
  get globalCompositeOperation () { return this.ctx.globalCompositeOperation }
  set lineCap (e) { this.enqueueActions(() => { this.ctx.lineCap = e }) }
  get lineCap () { return this.ctx.lineCap }
  set lineDashOffset (e) { this.enqueueActions(() => { this.ctx.lineDashOffset = e }) }
  get lineDashOffset () { return this.ctx.lineDashOffset }
  set lineJoin (e) { this.enqueueActions(() => { this.ctx.lineJoin = e }) }
  get lineJoin () { return this.ctx.lineJoin }
  set lineWidth (e) { this.enqueueActions(() => { this.ctx.lineWidth = e }) }
  get lineWidth () { return this.ctx.lineWidth }
  set miterLimit (e) { this.enqueueActions(() => { this.ctx.miterLimit = e }) }
  get miterLimit () { return this.ctx.miterLimit }
  set shadowBlur (e) { this.enqueueActions(() => { this.ctx.shadowBlur = e }) }
  get shadowBlur () { return this.ctx.shadowBlur }
  set shadowColor (e) { this.enqueueActions(() => { this.ctx.shadowColor = e }) }
  get shadowColor () { return this.ctx.shadowColor }
  set shadowOffsetX (e) { this.enqueueActions(() => { this.ctx.shadowOffsetX = e }) }
  get shadowOffsetX () { return this.ctx.shadowOffsetX }
  set shadowOffsetY (e) { this.enqueueActions(() => { this.ctx.shadowOffsetY = e }) }
  get shadowOffsetY () { return this.ctx.shadowOffsetY }
  set strokeStyle (e) { this.enqueueActions(() => { this.ctx.strokeStyle = e }) }
  get strokeStyle () { return this.ctx.strokeStyle as string }
  /** 小程序文档中不包括 ↓↓↓ */
  set textAlign (e) { this.ctx.textAlign = e }
  get textAlign () { return this.ctx.textAlign }
  set textBaseline (e) { this.ctx.textBaseline = e }
  get textBaseline () { return this.ctx.textBaseline }
  set direction (e) { this.ctx.direction = e }
  get direction () { return this.ctx.direction }
  set imageSmoothingEnabled (e) { this.enqueueActions(() => { this.ctx.imageSmoothingEnabled = e }) }
  get imageSmoothingEnabled () { return this.ctx.imageSmoothingEnabled }
  set imageSmoothingQuality (e) { this.enqueueActions(() => { this.ctx.imageSmoothingQuality = e }) }
  get imageSmoothingQuality () { return this.ctx.imageSmoothingQuality }
  set filter (e) { this.enqueueActions(() => { this.ctx.filter = e }) }
  get filter () { return this.ctx.filter }
  /** 小程序文档中不包括 ↑↑↑ */

  arc = this.enqueueActions(this.ctx.arc)
  arcTo = this.enqueueActions(this.ctx.arcTo)
  beginPath = this.enqueueActions(this.ctx.beginPath)
  bezierCurveTo = this.enqueueActions(this.ctx.bezierCurveTo)
  clearRect = this.enqueueActions(this.ctx.clearRect)
  clip = this.enqueueActions(this.ctx.clip)
  closePath = this.enqueueActions(this.ctx.closePath)

  createPattern (image: string, repetition: keyof Taro.CanvasContext.repetition): void {
    return this.createPattern(image, repetition)
  }

  /**
   * 将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中。
   * @todo 每次 draw 都会读取 width 和 height
   */
  async draw (reserve?: boolean, callback?: (...args: any[]) => any): Promise<void> {
    try {
      if (!reserve) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      }

      // 部分 action 是异步的
      for (const { func, args } of this.actions) {
        await func.apply(this.ctx, args)
      }

      this.emptyActions()
      callback && callback()
    } catch (e) {
      /* eslint-disable no-throw-literal */
      throw {
        errMsg: e.message
      }
    }
  }

  drawImage (imageResource: string, ...extra: any[]): void {
    type TExtra = [number, number]
    this.enqueueActions(() => {
      // 需要转换为 Image
      if (typeof imageResource === 'string') {
        const img = new Image()
        img.src = imageResource
        return new Promise<void>((resolve, reject) => {
          img.onload = () => {
            this.ctx.drawImage(img, ...extra as TExtra)
            resolve()
          }
          img.onerror = reject
        })
      }

      this.ctx.drawImage(imageResource, ...extra as TExtra)
    })
  }

  fill = this.enqueueActions(this.ctx.fill)
  fillRect = this.enqueueActions(this.ctx.fillRect)
  fillText = this.enqueueActions(this.ctx.fillText)
  lineTo = this.enqueueActions(this.ctx.lineTo)
  moveTo = this.enqueueActions(this.ctx.moveTo)
  quadraticCurveTo = this.enqueueActions(this.ctx.quadraticCurveTo)
  rect = this.enqueueActions(this.ctx.rect)
  restore = this.enqueueActions(this.ctx.restore)
  rotate = this.enqueueActions(this.ctx.rotate)
  save = this.enqueueActions(this.ctx.save)
  scale = this.enqueueActions(this.ctx.scale)

  setFillStyle (color: string | CanvasGradient): void {
    this.enqueueActions(() => { this.ctx.fillStyle = color })
  }

  setFontSize (fontSize: number): void {
    this.font = `${fontSize}px`
  }

  setGlobalAlpha (alpha: number): void {
    this.globalAlpha = alpha
  }

  setLineCap (lineCap: keyof Taro.CanvasContext.lineCap): void {
    this.lineCap = lineCap
  }

  setLineDash (pattern: number[], offset: number): void {
    this.enqueueActions(() => {
      this.ctx.setLineDash(pattern)
      this.ctx.lineDashOffset = offset
    })
  }

  setLineJoin (lineJoin: keyof Taro.CanvasContext.lineJoin): void {
    this.lineJoin = lineJoin
  }

  setLineWidth (lineWidth: number): void {
    this.lineWidth = lineWidth
  }

  setMiterLimit (miterLimit: number): void {
    this.miterLimit = miterLimit
  }

  setShadow (offsetX: number, offsetY: number, blur: number, color: string): void {
    this.enqueueActions(() => {
      this.ctx.shadowOffsetX = offsetX
      this.ctx.shadowOffsetY = offsetY
      this.ctx.shadowColor = color
      this.ctx.shadowBlur = blur
    })
  }

  setStrokeStyle (color: string | CanvasGradient): void {
    this.enqueueActions(() => { this.ctx.strokeStyle = color })
  }

  setTextAlign (align: keyof Taro.CanvasContext.align): void {
    this.textAlign = align
  }

  setTextBaseline (textBaseline: keyof Taro.CanvasContext.textBaseline): void {
    this.textBaseline = TextBaseLineMap[textBaseline] || 'alphabetic'
  }

  setTransform = this.enqueueActions(this.ctx.setTransform)
  stroke = this.enqueueActions(this.ctx.stroke)
  strokeRect = this.enqueueActions(this.ctx.strokeRect)
  strokeText = this.enqueueActions(this.ctx.strokeText)
  transform = this.enqueueActions(this.ctx.transform)
  translate = this.enqueueActions(this.ctx.translate)

  measureText (text: string): TextMetrics {
    return this.measureText(text)
  }

  createCircularGradient (x: number, y: number, r: number): CanvasGradient {
    const radialGradient = this.ctx.createRadialGradient(x, y, 0, x, y, r)

    return radialGradient
  }

  createLinearGradient (x0: number, y0: number, x1: number, y1: number): CanvasGradient {
    return this.createLinearGradient(x0, y0, x1, y1)
  }
}
