import { CanvasGradient } from '@tarojs/api'

interface IAction {
  func: (...arr: any[]) => void
  args: any[]
}

const TextBaseLineMap: Record<keyof Taro.CanvasContext.TextBaseline, CanvasTextBaseline> = {
  top: 'top',
  bottom: 'bottom',
  middle: 'middle',
  normal: 'alphabetic',
}

/**
 * canvas 组件的绘图上下文
 * 
 * @canUse CanvasContext
 * @__class 
 * [arc, arcTo, beginPath, bezierCurveTo, clearRect, clip, closePath, createCircularGradient, createLinearGradient, createPattern,\
 * draw, drawImage, fill, fillRect, fillText, lineTo, measureText, moveTo, quadraticCurveTo, rect,\
 * restore, rotate, save, scale, setFillStyle, setFontSize, setGlobalAlpha, setLineCap, setLineDash,\
 * setLineJoin, setLineWidth, setMiterLimit, setShadow, setStrokeStyle, setTextAlign, setTextBaseline, setTransform, stroke, strokeRect,\
 * strokeText, transform, translate]
 */
export class CanvasContext implements Taro.CanvasContext {
  __raw__: CanvasRenderingContext2D
  actions: IAction[] = []

  constructor (canvas, ctx) {
    this.canvas = canvas
    this.ctx = ctx
  }

  set ctx (e: CanvasRenderingContext2D) {
    this.__raw__ = e
  }

  get ctx () {
    return this.__raw__ || {}
  }

  canvas: HTMLCanvasElement

  protected emptyActions () {
    this.actions.length = 0
  }

  protected enqueueActions (func: IAction['func'], ...args) {
    this.actions.push({
      func,
      args,
    })
  }

  set fillStyle (e) {
    this.enqueueActions(() => {
      this.ctx.fillStyle = e
    })
  }

  get fillStyle () {
    return this.ctx.fillStyle as string
  }

  set font (e) {
    this.ctx.font = e
  }

  get font () {
    return this.ctx.font
  }

  set globalAlpha (e) {
    this.enqueueActions(() => {
      this.ctx.globalAlpha = e
    })
  }

  get globalAlpha () {
    return this.ctx.globalAlpha
  }

  set globalCompositeOperation (e) {
    this.enqueueActions(() => {
      this.ctx.globalCompositeOperation = e
    })
  }

  get globalCompositeOperation () {
    return this.ctx.globalCompositeOperation
  }

  set lineCap (e) {
    this.enqueueActions(() => {
      this.ctx.lineCap = e
    })
  }

  get lineCap () {
    return this.ctx.lineCap
  }

  set lineDashOffset (e) {
    this.enqueueActions(() => {
      this.ctx.lineDashOffset = e
    })
  }

  get lineDashOffset () {
    return this.ctx.lineDashOffset
  }

  set lineJoin (e) {
    this.enqueueActions(() => {
      this.ctx.lineJoin = e
    })
  }

  get lineJoin () {
    return this.ctx.lineJoin
  }

  set lineWidth (e) {
    this.enqueueActions(() => {
      this.ctx.lineWidth = e
    })
  }

  get lineWidth () {
    return this.ctx.lineWidth
  }

  set miterLimit (e) {
    this.enqueueActions(() => {
      this.ctx.miterLimit = e
    })
  }

  get miterLimit () {
    return this.ctx.miterLimit
  }

  set shadowBlur (e) {
    this.enqueueActions(() => {
      this.ctx.shadowBlur = e
    })
  }

  get shadowBlur () {
    return this.ctx.shadowBlur
  }

  set shadowColor (e) {
    this.enqueueActions(() => {
      this.ctx.shadowColor = e
    })
  }

  get shadowColor () {
    return this.ctx.shadowColor
  }

  set shadowOffsetX (e) {
    this.enqueueActions(() => {
      this.ctx.shadowOffsetX = e
    })
  }

  get shadowOffsetX () {
    return this.ctx.shadowOffsetX
  }

  set shadowOffsetY (e) {
    this.enqueueActions(() => {
      this.ctx.shadowOffsetY = e
    })
  }

  get shadowOffsetY () {
    return this.ctx.shadowOffsetY
  }

  set strokeStyle (e) {
    this.enqueueActions(() => {
      this.ctx.strokeStyle = e
    })
  }

  get strokeStyle () {
    return this.ctx.strokeStyle as string
  }

  /** 小程序文档中不包括 ↓↓↓ */
  set textAlign (e) {
    this.ctx.textAlign = e
  }

  get textAlign () {
    return this.ctx.textAlign
  }

  set textBaseline (e) {
    this.ctx.textBaseline = e
  }

  get textBaseline () {
    return this.ctx.textBaseline
  }

  set direction (e) {
    this.ctx.direction = e
  }

  get direction () {
    return this.ctx.direction
  }

  set imageSmoothingEnabled (e) {
    this.enqueueActions(() => {
      this.ctx.imageSmoothingEnabled = e
    })
  }

  get imageSmoothingEnabled () {
    return this.ctx.imageSmoothingEnabled
  }

  set imageSmoothingQuality (e) {
    this.enqueueActions(() => {
      this.ctx.imageSmoothingQuality = e
    })
  }

  get imageSmoothingQuality () {
    return this.ctx.imageSmoothingQuality
  }

  set filter (e) {
    this.enqueueActions(() => {
      this.ctx.filter = e
    })
  }

  get filter () {
    return this.ctx.filter
  }
  /** 小程序文档中不包括 ↑↑↑ */

  arc (...args) {
    return this.enqueueActions(this.ctx.arc, ...args)
  }

  arcTo (...args) {
    return this.enqueueActions(this.ctx.arcTo, ...args)
  }

  beginPath (...args) {
    return this.enqueueActions(this.ctx.beginPath, ...args)
  }

  bezierCurveTo (...args) {
    return this.enqueueActions(this.ctx.bezierCurveTo, ...args)
  }

  clearRect (...args) {
    return this.enqueueActions(this.ctx.clearRect, ...args)
  }

  clip (...args) {
    return this.enqueueActions(this.ctx.clip, ...args)
  }

  closePath (...args) {
    return this.enqueueActions(this.ctx.closePath, ...args)
  }

  createPattern (imageResource: string, repetition: keyof Taro.CanvasContext.Repetition): CanvasPattern | null | Promise<CanvasPattern | null> {
    // 需要转换为 Image
    if (typeof imageResource === 'string') {
      const img = new Image()
      img.src = imageResource
      return new Promise<CanvasPattern | null>((resolve, reject) => {
        img.onload = () => {
          resolve(this.ctx.createPattern(img, repetition))
        }
        img.onerror = reject
      })
    }
    return this.ctx.createPattern(imageResource, repetition)
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
        errMsg: e.message,
      }
    }
  }

  drawImage (imageResource: string, ...extra: any[]): void {
    // 如果是本地file://开头的文件路径，需要先转换为internal://开头的沙箱路径
    if (imageResource.startsWith('file://')) {
      // @ts-ignore
      imageResource = native.copyFileToSandboxCache(imageResource).internalCachePath
    }
    type TExtra = [number, number]
    this.enqueueActions(() => {
      // 需要转换为 Image
      if (typeof imageResource === 'string') {
        const img = new Image()
        img.src = imageResource
        return new Promise<void>((resolve, reject) => {
          img.onload = () => {
            this.ctx.drawImage(img, ...(extra as TExtra))
            resolve()
          }
          img.onerror = reject
        })
      }

      this.ctx.drawImage(imageResource, ...(extra as TExtra))
    })
  }

  fill (...args) {
    return this.enqueueActions(this.ctx.fill, ...args)
  }

  fillRect (...args) {
    return this.enqueueActions(this.ctx.fillRect, ...args)
  }

  fillText (...args) {
    return this.enqueueActions(this.ctx.fillText, ...args)
  }

  lineTo (...args) {
    return this.enqueueActions(this.ctx.lineTo, ...args)
  }

  moveTo (...args) {
    return this.enqueueActions(this.ctx.moveTo, ...args)
  }

  quadraticCurveTo (...args) {
    return this.enqueueActions(this.ctx.quadraticCurveTo, ...args)
  }

  rect (...args) {
    return this.enqueueActions(this.ctx.rect, ...args)
  }

  restore (...args) {
    return this.enqueueActions(this.ctx.restore, ...args)
  }

  rotate (...args) {
    return this.enqueueActions(this.ctx.rotate, ...args)
  }

  save (...args) {
    return this.enqueueActions(this.ctx.save, ...args)
  }

  scale (...args) {
    return this.enqueueActions(this.ctx.scale, ...args)
  }

  setFillStyle (color: string | CanvasGradient): void {
    this.enqueueActions(() => {
      this.ctx.fillStyle = color
    })
  }

  setFontSize (fontSize: number): void {
    this.enqueueActions(() => {
      this.ctx.font = `${fontSize}px sans-serif`
    })
  }

  setGlobalAlpha (alpha: number): void {
    this.enqueueActions(() => {
      this.ctx.globalAlpha = alpha
    })
  }

  setLineCap (lineCap: keyof Taro.CanvasContext.LineCap): void {
    this.enqueueActions(() => {
      this.ctx.lineCap = lineCap
    })
  }

  setLineDash (pattern: number[], offset: number): void {
    this.enqueueActions(() => {
      this.ctx.setLineDash(pattern)
      this.ctx.lineDashOffset = offset
    })
  }

  setLineJoin (lineJoin: keyof Taro.CanvasContext.LineJoin): void {
    this.enqueueActions(() => {
      this.ctx.lineJoin = lineJoin
    })
  }

  setLineWidth (lineWidth: number): void {
    this.enqueueActions(() => {
      this.ctx.lineWidth = lineWidth
    })
  }

  setMiterLimit (miterLimit: number): void {
    this.enqueueActions(() => {
      this.ctx.miterLimit = miterLimit
    })
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
    this.enqueueActions(() => {
      this.ctx.strokeStyle = color
    })
  }

  setTextAlign (align: keyof Taro.CanvasContext.Align): void {
    this.enqueueActions(() => {
      this.ctx.textAlign = align
    })
  }

  setTextBaseline (textBaseline: keyof Taro.CanvasContext.TextBaseline): void {
    this.enqueueActions(() => {
      this.ctx.textBaseline = TextBaseLineMap[textBaseline] || 'alphabetic'
    })
  }

  setTransform (...args) {
    return this.enqueueActions(this.ctx.setTransform, ...args)
  }

  stroke (...args) {
    return this.enqueueActions(this.ctx.stroke, ...args)
  }

  strokeRect (...args) {
    return this.enqueueActions(this.ctx.strokeRect, ...args)
  }

  strokeText (...args) {
    return this.enqueueActions(this.ctx.strokeText, ...args)
  }

  transform (...args) {
    return this.enqueueActions(this.ctx.transform, ...args)
  }

  translate (...args) {
    return this.enqueueActions(this.ctx.translate, ...args)
  }

  measureText (text: string): TextMetrics {
    return this.ctx.measureText(text)
  }

  createCircularGradient (x: number, y: number, r: number): CanvasGradient {
    const radialGradient = this.ctx.createRadialGradient(x, y, 0, x, y, r)

    return radialGradient
  }

  createLinearGradient (x0: number, y0: number, x1: number, y1: number): CanvasGradient {
    return this.ctx.createLinearGradient(x0, y0, x1, y1)
  }
}