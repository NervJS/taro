import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, Watch } from '@stencil/core'

import { snapTarget } from './snap-target'

@Component({
  tag: 'taro-movable-view-core',
  styleUrl: './view.scss'
})
export class MovableView {
  /**
   * 定义x轴方向的偏移，如果x的值不在可移动范围内，会自动移动到可移动范围；改变x的值会触发动画；单位支持px；
   */
  @Prop() x: number | string = 0
  /**
   * 定义y轴方向的偏移，如果y的值不在可移动范围内，会自动移动到可移动范围；改变y的值会触发动画；单位支持px；
   */
  @Prop() y: number | string = 0
  /**
   * 移动方向，属性值有all、vertical、horizontal、none
   */
  @Prop() direction: "all" | "vertical" | "horizontal" | "none" = "none"
  /**
   * 超过可移动区域后，是否还可以移动
   */
  @Prop() outOfBounds: boolean = false
  /**
   * 是否带有惯性
   */
  @Prop() inertia: boolean = false
  /**
   * 摩擦系数，用于控制惯性滑动的动画，值越大摩擦力越大，滑动越快停止；必须大于0，否则会被设置成默认值
   */
  @Prop() friction: number = 2
  /**
   * 阻尼系数，用于控制x或y改变时的动画和过界回弹的动画，值越大移动越快
   */
  @Prop() damping: number = 20
  /**
   * 是否禁用
   */
  @Prop() disabled: boolean = false
  /**
   * 是否支持双指缩放，默认缩放手势生效区域是在movable-view内
   */
  @Prop() scale: boolean = false
  /**
   * 定义缩放倍数最小值
   */
  @Prop() scaleMin: number = .5
  /**
   * 定义缩放倍数最大值
   */
  @Prop() scaleMax: number = 10
  /**
   * 定义缩放倍数，取值范围为 0.5 - 10
   */
  @Prop() scaleValue: number = 1
  /**
   * 是否使用动画
   */
  @Prop() animation: boolean = true
  /** X 轴吸附阈值；有限非负数启用，0 有效。 */
  @Prop() snapThresholdX?: number | null
  /** Y 轴吸附阈值，规则同 X。 */
  @Prop() snapThresholdY?: number | null

  /**
   * 拖动过程中触发的事件，event.detail = {x, y, source}
   */
  @Event({
    eventName: 'change'
  }) onChange: EventEmitter

  /**
   * 缩放过程中触发的事件，event.detail = {x, y, scale}，x和y字段在2.1.0之后支持
   */
  @Event({
    eventName: 'scale'
  }) onScale: EventEmitter

  /**
   * 初次手指触摸后移动为横向的移动时触发，如果catch此事件，则意味着touchmove事件也被catch
   */
  @Event({
    eventName: 'htouchmove'
  }) onHTouchMove: EventEmitter

  /**
   * 初次手指触摸后移动为纵向的移动时触发，如果catch此事件，则意味着touchmove事件也被catch
   */
  @Event({
    eventName: 'vtouchmove'
  }) onVTouchMove: EventEmitter

  @Element() element: HTMLElement

  @Watch('x')
  watchX (newValue: number | string) {
    const x = parseFloat(`${newValue || 0}`)
    if (this.snapEnabled) {
      if (this.touching || this.snapFrame !== undefined) {
        const index = this.findEcho(this.emittedX, this.echoX, x)
        if (index !== -1) {
          this.echoX = index + 1
          return
        }
        // React may write the latest emitted position again after it was consumed.
        if (Math.abs(x - (this.translateX - this.scaleOffset.x)) <= 0.05) return
        if (this.echoX > 0 && Math.abs(this.emittedX[this.echoX - 1] - x) <= 0.1) return
      }
      this.cancelSnap()
      this.clearEmittedX()
      this.setTransform(x, this.translateY, undefined, '')
    } else {
      this.setTransform(x, this.translateY)
    }
  }

  @Watch('y')
  watchY (newValue: number | string) {
    const y = parseFloat(`${newValue || 0}`)
    if (this.snapEnabled) {
      if (this.touching || this.snapFrame !== undefined) {
        const index = this.findEcho(this.emittedY, this.echoY, y)
        if (index !== -1) {
          this.echoY = index + 1
          return
        }
        if (Math.abs(y - (this.translateY - this.scaleOffset.y)) <= 0.05) return
        if (this.echoY > 0 && Math.abs(this.emittedY[this.echoY - 1] - y) <= 0.1) return
      }
      this.cancelSnap()
      this.clearEmittedY()
      this.setTransform(this.translateX, y, undefined, '')
    } else {
      this.setTransform(this.translateX, y)
    }
  }

  @Watch('snapThresholdX')
  @Watch('snapThresholdY')
  watchSnapThreshold () {
    this.cancelSnap()
  }

  @Watch('disabled')
  watchDisabled (disabled: boolean) {
    if (disabled) {
      this.touching = false
      this.cancelSnap()
    }
  }

  @Watch('scaleMin')
  @Watch('scaleMax')
  watchScaleMinOrMax () {
    this.cancelSnap()
    if (!this.scale) return false
    this.updateScale(this.currentScale, true)
    this.setOriginScale(this.currentScale)
  }

  @Watch('scaleValue')
  watchScaleValue (scale) {
    this.cancelSnap()
    if (!this.scale) {
      return false
    }
    this.updateScale(scale, true)
    this.setOriginScale(scale)

    return scale
  }

  /**
   * 设置父节点
   */
  @Method()
  async setParent ({ element, area }: { element: HTMLElement, area: { width: number; height: number; } }) {
    const scale = this.scale ? this.scaleValue : 1
    const initialized = !!this.parent
    const bounds = [this.minX, this.maxX, this.minY, this.maxY]
    this.area = area
    this.parent = element

    this.updateOffset()
    this.updateScaleOffset(scale)
    this.updateBoundary()
    if (this.snapTarget && this.boundsChanged(bounds)) this.cancelSnap()
    if (this.snapEnabled && initialized) {
      const { x, y } = this.getLimitXY(this.translateX, this.translateY)
      this.setTransform(x, y, scale)
    } else {
      this.setTransform(Number(this.x) + this.scaleOffset.x, Number(this.y) + this.scaleOffset.y, scale, "", true)
    }
    this.setOriginScale(scale)
  }

  /**
   * 结束缩放
   */
  @Method()
  async endScale () {
    this.scaling = false
    this.setOriginScale(this.currentScale)
  }

  /**
   * 更新缩放
   */
  @Method()
  async setScale (scale: number) {
    if (!this.scale) {
      return
    }
    this.scaling = true
    this.updateScale(scale * this.originScale)
  }

  connectedCallback () {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const name = mutation.attributeName
        if (name && ["class", "style"].includes(name)) {
          const oldValue = mutation.oldValue
          const newValue = (mutation.target as HTMLElement).getAttribute(name)
          if (oldValue === newValue) {
            return
          }
          const filter = (input: string | null) => {
            return input?.split(";").filter((item) => {
              return !["transform", "-webkit-transform", "will-change"].find((key) => {
                return item.trim().startsWith(key)
              })
            }).join(";")
          }
          if (name === "style" && filter(newValue) === filter(oldValue)) {
            return
          }

          const bounds = [this.minX, this.maxX, this.minY, this.maxY]
          this.updateOffset()
          this.updateScaleOffset()
          this.updateBoundary()
          if (this.snapTarget && this.boundsChanged(bounds)) this.cancelSnap()
          if (this.snapEnabled) {
            const { x, y } = this.getLimitXY(this.translateX, this.translateY)
            this.setTransform(x, y)
          } else {
            this.setTransform(this.translateX, this.translateY)
          }
        }
      })
    })

    this.observer.observe(this.element, {
      attributes: true,
      attributeOldValue: true
    })
  }

  disconnectedCallback () {
    this.observer?.disconnect()
    this.cancelSnap()
  }

  /** 观察者 */
  private observer?: MutationObserver
  /** 缩放中 */
  private scaling: boolean
  /** 移动中 */
  private touching: boolean
  /** 更新中 */
  private updating: boolean
  /** 水平方向是否可移动 */
  private xMove: boolean
  /** 垂直方向是否可移动 */
  private yMove: boolean
  /** 首次移动方向事件是否已触发 */
  private firstMoveFireEvent: boolean
  /** 当前水平偏移 */
  private translateX: number = 0
  /** 当前垂直偏移 */
  private translateY: number = 0
  /** touch-start 原点 */
  private origin: { x: number; y: number; } = { x: 0, y: 0 }
  /** 父容器大小 */
  private area: { width: number; height: number; } = { width: 0, height: 0 }
  /** 父容器 */
  private parent?: HTMLElement
  /** 原始缩放倍数 */
  private originScale: number = 1
  /** 当前缩放倍数 */
  private currentScale: number = 1
  /** 宽度 */
  private width: number = 0
  /** 高度 */
  private height: number = 0
  /** 移动边界 */
  private minX: number = 0
  private minY: number = 0
  private maxX: number = 0
  private maxY: number = 0
  /** 移动基础位置 */
  private baseX: number = 0
  private baseY: number = 0
  /** 偏移量 */
  private offset: { x: number; y: number; } = { x: 0, y: 0 }
  private scaleOffset: { x: number; y: number; } = { x: 0, y: 0 }
  private multiTouched: boolean = false
  private snapFrame?: number
  private snapTarget?: { x: number; y: number }
  private emittedX: number[] = []
  private emittedY: number[] = []
  private echoX = 0
  private echoY = 0

  private get snapEnabled () {
    return this.validThreshold(this.snapThresholdX) || this.validThreshold(this.snapThresholdY)
  }

  private validThreshold (value?: number | null): boolean {
    return typeof value === 'number' && Number.isFinite(value) && value >= 0
  }

  /** 未消费位置和最近一次已消费位置可作为回填；更早的位置视为代码定位。 */
  private findEcho (values: number[], start: number, value: number): number {
    for (let index = start; index < values.length; index++) {
      if (Math.abs(values[index] - value) <= 0.1) return index
    }
    return -1
  }

  private clearEmittedX () {
    this.emittedX = []
    this.echoX = 0
  }

  private clearEmittedY () {
    this.emittedY = []
    this.echoY = 0
  }

  private clearEmitted () {
    this.clearEmittedX()
    this.clearEmittedY()
  }

  private boundsChanged (before: number[]): boolean {
    const current = [this.minX, this.maxX, this.minY, this.maxY]
    return before.some((value, index) => value !== current[index])
  }

  private cancelSnap (keepTarget = false) {
    if (this.snapFrame !== undefined) cancelAnimationFrame(this.snapFrame)
    this.snapFrame = undefined
    if (!keepTarget) this.snapTarget = undefined
  }

  private moveToSnap (x: number, y: number) {
    this.snapTarget = { x, y }
    if (!this.animation) {
      this.setTransform(x, y, undefined, 'snap')
      this.snapTarget = undefined
      return
    }

    const activeTarget = this.snapTarget
    const startX = this.translateX
    const startY = this.translateY
    const damping = this.damping > 0 && Number.isFinite(this.damping) ? this.damping : 20
    const duration = Math.max(120, Math.min(450, 6000 / damping))
    let startTime: number | undefined
    const step = (time: number) => {
      if (startTime === undefined) startTime = time
      const progress = Math.min((time - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      this.setTransform(startX + (x - startX) * eased, startY + (y - startY) * eased, undefined, 'snap')
      if (this.snapTarget !== activeTarget) return
      if (progress < 1) {
        this.snapFrame = requestAnimationFrame(step)
      } else {
        this.snapFrame = undefined
        this.snapTarget = undefined
      }
    }
    this.snapFrame = requestAnimationFrame(step)
  }

  private setTouchTransform (x: number, y: number) {
    let nextX = this.xMove ? x + this.baseX : 0
    let nextY = this.yMove ? y + this.baseY : 0
    if (this.snapEnabled) {
      if (!this.xMove) nextX = this.baseX
      if (!this.yMove) nextY = this.baseY
    }
    this.setTransform(nextX, nextY)
  }

  getLimitXY = (x: number, y: number) => {
    let outOfBounds = false
    x > this.maxX ? (x = this.maxX, outOfBounds = true) : x < this.minX && (x = this.minX, outOfBounds = true)
    y > this.maxY ? (y = this.maxY, outOfBounds = true) : y < this.minY && (y = this.minY, outOfBounds = true)

    return { x, y, outOfBounds }
  }

  animationTo = (x: number, y: number, scale?: number, source?: string, noEmitChange?: boolean, emitScale?: boolean, callback?: () => void) => {
    if (this.animation) {
      this.setTransform(x, y, scale, source, noEmitChange, emitScale)
      callback?.()
    } else {
      this.setTransform(x, y, scale, source, noEmitChange, emitScale)
    }
  }

  setTransform = (x: number, y: number, scale?: number, source?: string, noEmitChange?: boolean, emitScale?: boolean) => {
    x = Number(x.toFixed(1))
    y = Number(y.toFixed(1))
    scale = Number((scale ?? this.currentScale).toFixed(3))

    if (!this.outOfBounds) {
      const limit = this.getLimitXY(x, y)
      x = limit.x
      y = limit.y
    }

    const subtract = (e, t) => {
      return +((1e3 * e - 1e3 * t) / 1e3).toFixed(1)
    }

    const realX = subtract(x, this.scaleOffset.x)
    const realY = subtract(y, this.scaleOffset.y)
    const changed = this.translateX !== x || this.translateY !== y
    if (changed && !noEmitChange && !this.snapEnabled) {
      this.onChange.emit({ x: realX, y: realY, source })
    }

    if (scale !== this.currentScale) {
      emitScale && this.onScale.emit({
        scale,
        x: realX,
        y: realY
      })
    }

    const transform = `translateX(${x}px) translateY(${y}px) translateZ(0px) scale(${scale})`
    this.element.style.transform = transform
    this.element.style.webkitTransform = transform
    this.translateX = x
    this.translateY = y
    this.currentScale = scale
    if (changed && !noEmitChange && this.snapEnabled) {
      this.emittedX.push(realX)
      this.emittedY.push(realY)
      this.onChange.emit({ x: realX, y: realY, source })
    }
  }

  updateOffset = () => {
    const offset = (element: HTMLElement, parent: HTMLElement): { left: number; top: number; } => {
      if (element === parent || !element.offsetParent) {
        return { left: 0, top: 0 }
      }
      const current = offset(element.offsetParent as HTMLElement, parent)
      return {
        left: element.offsetLeft + current.left,
        top: element.offsetTop + current.top
      }
    }

    if (!this.parent) {
      return
    }

    const current = offset(this.element, this.parent)

    this.offset.x = current.left
    this.offset.y = current.top
  }

  updateScaleOffset = (scale: number = this.currentScale) => {
    const rect = this.element.getBoundingClientRect()
    this.height = rect.height / this.currentScale
    this.width = rect.width / this.currentScale
    this.scaleOffset.x = (this.width * scale - this.width) / 2
    this.scaleOffset.y = (this.height * scale - this.height) / 2
  }

  updateBoundary = () => {
    const x1 = 0 - this.offset.x + this.scaleOffset.x
    const x2 = this.area.width - this.width - this.offset.x - this.scaleOffset.x
    this.minX = Math.min(x1, x2)
    this.maxX = Math.max(x1, x2)
    const y1 = 0 - this.offset.y + this.scaleOffset.y
    const y2 = this.area.height - this.height - this.offset.y - this.scaleOffset.y
    this.minY = Math.min(y1, y2)
    this.maxY = Math.max(y1, y2)
  }

  updateScale = (scale: number, animation?: boolean, animationCallback?: () => void) => {
    if (!this.scale) {
      return
    }

    const target = this.adjustScale(scale)
    this.updateScaleOffset(target)
    this.updateBoundary()

    const { x, y } = this.getLimitXY(this.translateX, this.translateY)
    if (animation) {
      this.animationTo(x, y, target, "", true, true, animationCallback)
    } else if (!this.updating) {
      this.updating = true
      requestAnimationFrame(() => {
        this.setTransform(x, y, target, "", true, true)
        this.updating = false
      })
    }
  }

  setOriginScale = (scale: number) => {
    this.originScale = scale
  }

  adjustScale = (scale: number) => {
    return Math.min(10, this.scaleMax, Math.max(.5, this.scaleMin, scale))
  }

  componentDidLoad () {
    this.element.style.transformOrigin = "center"

    this.xMove = ["horizontal", "all"].includes(this.direction)
    this.yMove = ["vertical", "all"].includes(this.direction)
    if (this.friction <= 0) {
      this.friction = 2
    }

    if (this.x || this.y) {
      const x = parseFloat(`${this.x || 0}`)
      const y = parseFloat(`${this.y || 0}`)
      this.setTransform(x, y, undefined, this.snapEnabled ? '' : undefined)
    }
  }

  handleTouchStart = (e: TouchEvent) => {
    if (this.snapEnabled && e.touches.length > 1) this.multiTouched = true
    const touches = e.touches
    if (this.disabled || touches.length > 1 || !this.element) return
    const touch = touches[0]

    if (this.snapFrame !== undefined) this.cancelSnap(true)
    this.clearEmitted()
    this.multiTouched = false
    this.touching = true
    this.firstMoveFireEvent = false
    this.origin.x = touch.screenX
    this.origin.y = touch.screenY
    this.baseX = this.translateX
    this.baseY = this.translateY
    this.element.style.willChange = "transform"
  }

  handleTouchMove = (e: TouchEvent) => {
    const touches = e.touches
    if (this.snapEnabled && (touches.length > 1 || this.scaling)) this.multiTouched = true
    if (this.disabled || !this.element || this.scaling || !this.touching || touches.length > 1) return

    if (this.direction !== "horizontal") e.preventDefault()
    const touch = touches[0]
    const x = touch.screenX - this.origin.x
    const y = touch.screenY - this.origin.y
    this.setTouchTransform(x, y)

    if (!this.firstMoveFireEvent) {
      this.firstMoveFireEvent = true
      const onTouchMove = Math.abs(x) > Math.abs(y) ? this.onHTouchMove : this.onVTouchMove
      onTouchMove.emit({
        originalEvent: e,
        bubbles: false,
        capturePhase: false,
        composed: true,
        extraFields: {
          touches: e.touches || {},
          changedTouches: e.changedTouches || {}
        }
      })
    }
  }

  handleTouchEnd = (e: TouchEvent) => {
    const touch = e.changedTouches[0]
    if (this.disabled || !this.touching || !touch) return
    if (this.snapEnabled && (this.multiTouched || this.scaling || e.touches.length > 0)) {
      this.touching = false
      this.multiTouched = false
      this.cancelSnap()
      return
    }
    this.touching = false

    const x = touch.screenX - this.origin.x
    const y = touch.screenY - this.origin.y
    this.setTouchTransform(x, y)
    if (!this.snapEnabled) return

    const start = this.getLimitXY(this.baseX, this.baseY)
    const end = this.getLimitXY(this.translateX, this.translateY)
    const moved = Math.abs(start.x - end.x) >= 0.05 || Math.abs(start.y - end.y) >= 0.05
    if (!moved) {
      if (this.snapTarget) this.moveToSnap(this.snapTarget.x, this.snapTarget.y)
      return
    }

    this.snapTarget = undefined
    const targetX = this.xMove ? snapTarget(this.baseX, this.translateX, this.minX, this.maxX, this.snapThresholdX) : null
    const targetY = this.yMove ? snapTarget(this.baseY, this.translateY, this.minY, this.maxY, this.snapThresholdY) : null
    if (targetX !== null || targetY !== null) {
      this.moveToSnap(targetX ?? this.translateX, targetY ?? this.translateY)
    }
  }

  handleTouchCancel = () => {
    this.touching = false
    this.multiTouched = false
    this.cancelSnap()
  }

  render () {
    return (
      <Host
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
        onTouchCancel={this.handleTouchCancel}
      />
    )
  }
}
