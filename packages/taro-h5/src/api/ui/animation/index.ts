import Taro from '@tarojs/api'

/**
 * H5 下的 styleSheet 操作
 * @author leeenx
 */
class StyleSheet {
  constructor () {
    this.$style = document.createElement('style')
  }

  $style?: HTMLStyleElement | null = null
  sheet?: CSSStyleSheet | null = null

  appendStyleSheet = () => {
    if (this.$style) {
      const head = document.getElementsByTagName('head')[0]
      this.$style.setAttribute('type', 'text/css')
      this.$style.setAttribute('data-type', 'Taro')
      head.appendChild(this.$style)
      this.sheet = this.$style.sheet
    }
    if (this.sheet && !('insertRule' in this.sheet)) {
      console.warn('当前浏览器不支持 stylesheet.insertRule 接口')
    }
  }

  // 添加样式命令
  add = (cssText, index = 0) => {
    if (this.sheet === null) {
      // $style 未插入到 DOM
      this.appendStyleSheet()
    }
    this.sheet?.insertRule(cssText, index)
  }
}

const styleSheet = new StyleSheet()

// 监听事件
let TRANSITION_END = 'transitionend'
let TRANSFORM = 'transform'

const $detect = document.createElement('div')
$detect.style.cssText = '-webkit-animation-name:webkit;-moz-animation-name:moz;-ms-animation-name:ms;animation-name:standard;'
if ($detect.style['animation-name'] === 'standard') {
  // 支持标准写法
  TRANSITION_END = 'transitionend'
  TRANSFORM = 'transform'
} else if ($detect.style['-webkit-animation-name'] === 'webkit') {
  // webkit 前缀
  TRANSITION_END = 'webkitTransitionEnd'
  TRANSFORM = '-webkit-transform'
} else if ($detect.style['-moz-animation-name'] === 'moz') {
  // moz 前缀
  TRANSITION_END = 'mozTransitionEnd'
  TRANSFORM = '-moz-transform'
} else if ($detect.style['-ms-animation-name'] === 'ms') {
  // ms 前缀
  TRANSITION_END = 'msTransitionEnd'
  TRANSFORM = '-ms-transform'
}

let animId = 0

/**
 * 所有动画的关键帧总数，key 为 createAnimationData() 产出的动画标识。
 * 动画标识里已经包含各自实例的 id，因此不会相互覆盖。
 */
const animationStepsMap: Record<string, number> = {}

/**
 * transitionend 监听器全局只注册一次。
 * 此前每个 Animation 实例都会往 document.body 上挂一个监听器，
 * 而 createAnimation 通常在渲染或事件回调里反复调用，监听器会无限累积；
 * 同时监听器闭包持有实例本身，导致实例与其动画数据也无法被回收。
 */
let isTransitionEndListened = false

function handleTransitionEnd (e: Event) {
  const target = e.target as HTMLElement | null
  if (!target || typeof target.getAttribute !== 'function') return
  // atom 环境下，animation 属性不会显示，所以要改成 data-animation。
  // 这里按每次事件的目标元素判断：若缓存成实例状态，任意一个不带动画属性的
  // 元素冒泡上来就会把它永久翻转，导致之后真正的动画再也无法推进。
  const animAttr = target.getAttribute('animation') !== null ? 'animation' : 'data-animation'
  const animData = target.getAttribute(animAttr)
  // 没有动画存在
  if (animData === null) return
  const [animName, animPath] = animData.split('__')
  if (!animPath) return
  const [animIndex, __stepIndex = 0] = animPath.split('--')
  // 动画总的关键帧
  const animStepsCount = animationStepsMap[`${animName}__${animIndex}`]
  // 不是 Taro 创建的动画
  if (animStepsCount === undefined) return
  const stepIndex = Number(__stepIndex)
  const animStepsMaxIndex = animStepsCount - 1
  if (stepIndex < animStepsMaxIndex) {
    // 播放下一个关键帧（因为 nerv 和 react 有差异所以 animation & data-animation 都需要写）
    const nextAnimData = `${animName}__${animIndex}--${stepIndex + 1}`
    // 两个属性必须同步推进：生成的 CSS 规则同时匹配 [animation] 和 [data-animation]，
    // 只更新其中一个的话，另一个会停在上一帧，旧帧规则仍然命中并盖掉后续帧的样式。
    if (target.getAttribute('data-animation') !== null) {
      target.setAttribute('data-animation', nextAnimData)
    }
    target.setAttribute('animation', nextAnimData)
  }
}

interface IAnimationAttr {
  duration: number
  delay: number
  timingFunction: string
  transformOrigin: string
}

interface IRule {
  key: string
  rule: string
}

interface ITransform {
  key: string
  transform: string
}

class Animation implements Taro.Animation {
  unit: string
  id: number
  DEFAULT: IAnimationAttr

  constructor (
    {
      duration = 400,
      delay = 0,
      timingFunction = 'linear',
      transformOrigin = '50% 50% 0',
      unit = 'px'
    }: Taro.createAnimation.Option = {}
  ) {
    // 默认值
    this.setDefault(duration, delay, timingFunction, transformOrigin)
    this.unit = unit
    // 动画 id
    this.id = ++animId
    // 监听事件：全局只注册一次，避免监听器随 createAnimation 调用次数累积
    if (!isTransitionEndListened) {
      isTransitionEndListened = true
      document.body.addEventListener(TRANSITION_END, handleTransitionEnd)
    }
  }

  transformUnit (...args) {
    const ret: string[] = []
    args.forEach(each => {
      ret.push(isNaN(each) ? each : `${each}${this.unit}`)
    })
    return ret
  }

  // 设置默认值
  setDefault (duration, delay, timingFunction, transformOrigin) {
    this.DEFAULT = { duration, delay, timingFunction, transformOrigin }
  }

  // 属性组合
  rules: IRule[] = []
  // transform 对象
  transform: ITransform[] = []
  // 组合动画
  steps: string[] = []
  // 已产出的动画数量，用于生成动画标识
  animationMapCount = 0
  // 历史动画
  historyAnimations: ITransform[] = []
  // 历史规则
  historyRules: IRule[] = []

  matrix (a: number, b: number, c: number, d: number, tx: number, ty: number) {
    this.transform.push({ key: 'matrix', transform: `matrix(${a}, ${b}, ${c}, ${d}, ${tx}, ${ty})` })
    return this
  }

  matrix3d (a1: number, b1: number, c1: number, d1: number, a2: number, b2: number, c2: number, d2: number, a3: number, b3: number, c3: number, d3: number, a4: number, b4: number, c4: number, d4: number) {
    this.transform.push({
      key: 'matrix3d',
      transform: `matrix3d(${a1}, ${b1}, ${c1}, ${d1}, ${a2}, ${b2}, ${c2}, ${d2}, ${a3}, ${b3}, ${c3}, ${d3}, ${a4}, ${b4}, ${c4}, ${d4})`,
    })
    return this
  }

  rotate (angle: number) {
    this.transform.push({ key: 'rotate', transform: `rotate(${angle}deg)` })
    return this
  }

  rotate3d (x: number, y?: number, z?: number, angle?: number) {
    if (typeof y !== 'number') {
      this.transform.push({ key: 'rotate3d', transform: `rotate3d(${x})` })
    } else {
      this.transform.push({ key: 'rotate3d', transform: `rotate3d(${x}, ${y || 0}, ${z || 0}, ${angle || 0}deg)` })
    }
    return this
  }

  rotateX (angle) {
    this.transform.push({ key: 'rotateX', transform: `rotateX(${angle}deg)` })
    return this
  }

  rotateY (angle) {
    this.transform.push({ key: 'rotateY', transform: `rotateY(${angle}deg)` })
    return this
  }

  rotateZ (angle) {
    this.transform.push({ key: 'rotateZ', transform: `rotateZ(${angle}deg)` })
    return this
  }

  scale (x: number, y?: number) {
    const scaleY = (typeof y !== 'undefined' && y !== null) ? y : x
    this.transform.push({ key: 'scale', transform: `scale(${x}, ${scaleY})` })
    return this
  }

  scale3d (x, y, z) {
    this.transform.push({ key: 'scale3d', transform: `scale3d(${x}, ${y}, ${z})` })
    return this
  }

  scaleX (scale) {
    this.transform.push({ key: 'scaleX', transform: `scaleX(${scale})` })
    return this
  }

  scaleY (scale) {
    this.transform.push({ key: 'scaleY', transform: `scaleY(${scale})` })
    return this
  }

  scaleZ (scale) {
    this.transform.push({ key: 'scaleZ', transform: `scaleZ(${scale})` })
    return this
  }

  skew (x, y) {
    this.transform.push({ key: 'skew', transform: `skew(${x}deg, ${y}deg)` })
    return this
  }

  skewX (angle) {
    this.transform.push({ key: 'skewX', transform: `skewX(${angle}deg)` })
    return this
  }

  skewY (angle) {
    this.transform.push({ key: 'skewY', transform: `skewY(${angle}deg)` })
    return this
  }

  translate (x, y) {
    [x, y] = this.transformUnit(x, y)
    this.transform.push({ key: 'translate', transform: `translate(${x}, ${y})` })
    return this
  }

  translate3d (x, y, z) {
    [x, y, z] = this.transformUnit(x, y, z)
    this.transform.push({ key: 'translate3d', transform: `translate3d(${x}, ${y}, ${z})` })
    return this
  }

  translateX (translate) {
    [translate] = this.transformUnit(translate)
    this.transform.push({ key: 'translateX', transform: `translateX(${translate})` })
    return this
  }

  translateY (translate) {
    [translate] = this.transformUnit(translate)
    this.transform.push({ key: 'translateY', transform: `translateY(${translate})` })
    return this
  }

  translateZ (translate) {
    [translate] = this.transformUnit(translate)
    this.transform.push({ key: 'translateZ', transform: `translateZ(${translate})` })
    return this
  }

  opacity (value) {
    this.rules.push({ key: 'opacity', rule: `opacity: ${value}` })
    return this
  }

  backgroundColor (value) {
    this.rules.push({ key: 'backgroundColor', rule: `background-color: ${value}` })
    return this
  }

  width (value) {
    [value] = this.transformUnit(value)
    this.rules.push({ key: 'width', rule: `width: ${value}` })
    return this
  }

  height (value) {
    [value] = this.transformUnit(value)
    this.rules.push({ key: 'height', rule: `height: ${value}` })
    return this
  }

  top (value) {
    [value] = this.transformUnit(value)
    this.rules.push({ key: 'top', rule: `top: ${value}` })
    return this
  }

  right (value) {
    [value] = this.transformUnit(value)
    this.rules.push({ key: 'right', rule: `right: ${value}` })
    return this
  }

  bottom (value) {
    [value] = this.transformUnit(value)
    this.rules.push({ key: 'bottom', rule: `bottom: ${value}` })
    return this
  }

  left (value) {
    [value] = this.transformUnit(value)
    this.rules.push({ key: 'left', rule: `left: ${value}` })
    return this
  }

  // 关键帧载入
  step (arg: Partial<IAnimationAttr> = {}) {
    const { DEFAULT } = this
    const {
      duration = DEFAULT.duration,
      delay = DEFAULT.delay,
      timingFunction = DEFAULT.timingFunction,
      transformOrigin = DEFAULT.transformOrigin,
    } = arg
    // 生成一条 transition 动画

    this.transform.map((t0) => {
      const index = this.historyAnimations.findIndex((t1) => t1.key === t0.key)
      if (index === -1) {
        this.historyAnimations.push(t0)
      } else {
        this.historyAnimations[index] = t0
      }
    })
    const transforms = this.historyAnimations.map((t) => t.transform)
    const transformSequence = transforms.length > 0 ? `${TRANSFORM}:${transforms.join(' ')}!important` : ''

    this.rules.map((r0) => {
      const index = this.historyRules.findIndex((r1) => r1.key === r0.key)
      if (index === -1) {
        this.historyRules.push(r0)
      } else {
        this.historyRules[index] = r0
      }
    })
    const rules = this.historyRules.map((t) => t.rule)
    const ruleSequence = rules.length > 0 ? rules.map((rule) => `${rule}!important`).join(';') : ''

    this.steps.push(
      [
        ruleSequence,
        transformSequence,
        `${TRANSFORM}-origin: ${transformOrigin}`,
        `transition: all ${duration}ms ${timingFunction} ${delay}ms`,
      ]
        .filter((item) => item !== '')
        .join(';')
    )
    // 清空 rules 和 transform
    this.rules = []
    this.transform = []
    return this as Taro.Animation
  }

  // 创建底层数据
  createAnimationData () {
    const animIndex = `taro-h5-poly-fill/${this.id}/create-animation__${this.animationMapCount++}`
    // 记录动画分几个 step ----- 永久保留
    animationStepsMap[animIndex] = this.steps.length
    // 吐出 step
    this.steps.forEach((step, index) => {
      const selector =
        index === 0
          ? `[animation="${animIndex}"], [data-animation="${animIndex}"]`
          : `[animation="${animIndex}--${index}"], [data-animation="${animIndex}--${index}"]`
      styleSheet.add(`${selector} { ${step} }`)
    })

    // 清空 steps
    this.steps = []
    return animIndex
  }

  // 动画数据产出
  export () {
    return this.createAnimationData() as unknown as ReturnType<Taro.Animation['export']>
  }
}

// h5 的 createAnimation
export const createAnimation: typeof Taro.createAnimation = (option) => {
  return new Animation(option)
}
