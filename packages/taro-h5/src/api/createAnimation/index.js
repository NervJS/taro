/**
 * H5 下的 styleSheet 操作
 * @author leeenx
 */
class StyleSheet {
  constructor () {
    this.$style = document.createElement('style')
  }
  $style = null
  sheet = null
  appendStyleSheet = () => {
    this.$style.setAttribute('type', 'text/css')
    this.$style.setAttribute('data-type', 'Taro')
    document.getElementsByTagName('head')[0].appendChild(this.$style)
    this.sheet = this.$style.sheet
    if (!('insertRule' in this.sheet)) {
      console.warn('当前浏览器不支持 stylesheet.insertRule 接口')
    }
  }
  // 添加样式命令
  add = (cssText, index = 0) => {
    if (this.sheet === null) {
      // $style 未插入到 DOM
      this.appendStyleSheet()
    }
    this.sheet.insertRule(cssText, index)
  }
}

const styleSheet = new StyleSheet()

// 监听事件
let TRANSITION_END = 'transitionend'
let TRANSFORM = 'transform'

const $detect = document.createElement('div')
$detect.style.cssText = `
  -webkit-animation-name: webkit;
  -moz-animation-name: moz;
  -ms-animation-name: ms;
  animation-name: standard;
`
if ($detect.style['animation-name'] === 'standard') {
  // 支持标准写法
  TRANSITION_END = 'transitionend'
  TRANSFORM = 'transform'
} else if ($detect.style['-webkit-animation-name'] === 'webkit') {
  // webkit 前缀
  TRANSITION_END = 'webkitTransionEnd'
  TRANSFORM = '-webkit-transform'
} else if ($detect.style['-moz-animation-name'] === 'moz') {
  // webkit 前缀
  TRANSITION_END = 'mozTransionEnd'
  TRANSFORM = '-moz-transform'
} else if ($detect.style['-ms-animation-name'] === 'ms') {
  // webkit 前缀
  TRANSITION_END = 'MSTransionEnd'
  TRANSFORM = '-ms-transform'
}

let animId = 0

// Animation 类
class Animation {
  constructor (
    {
      duration = 400,
      delay = 0,
      timingFunction = 'linear',
      transformOrigin = '50% 50% 0',
      unit = 'px'
    } = {}
  ) {
    // 默认值
    this.setDefault(duration, delay, timingFunction, transformOrigin)
    this.unit = unit
    // atom 环境下，animation 属性不会显示，所以要改成 data-animation
    let animAttr = 'animation'
    // 动画 id
    this.id = ++animId
    // 监听事件
    document.body.addEventListener(TRANSITION_END, e => {
      const { target } = e
      if (target.getAttribute(animAttr) === null) {
        animAttr = 'data-animation'
      }
      const animData = target.getAttribute(animAttr)
      // 没有动画存在
      if (animData === null) return
      const [animName, animPath] = animData.split('__')
      if (animName === `taro-h5-poly-fill/${this.id}/create-animation`) {
        const [animIndex, stepIndex = 0] = animPath.split('--')
        // 动画总的关键帧
        const animStepsCount = this.animationMap[`${animName}__${animIndex}`]
        const animStepsMaxIndex = animStepsCount - 1
        if (stepIndex < animStepsMaxIndex) {
          // 播放下一个关键帧（因为 nevr 和 react 有差异所以 animation & data-animation 都需要写）
          target.setAttribute(animAttr, `${animName}__${animIndex}--${stepIndex + 1}`)
          if (animAttr === 'animation') {
            // Nerv 环境，animation & data-animation 双重保险
            target.setAttribute('data-animation', `${animName}__${animIndex}--${stepIndex + 1}`)
          }
        }
      }
    })
  }
  transformUnit (...args) {
    const ret = []
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
  rules = []
  // transform 对象
  transform = [`${TRANSFORM}:`]
  // 组合动画
  steps = []
  // 动画 map ----- 永久保留
  animationMap = {}
  // animationMap 的长度
  animationMapCount = 0
  matrix (a, b, c, d, e, f) {
    this.transform.push(`matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`)
    return this
  }
  matrix3d (a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3, a4, b4, c4, d4) {
    this.transform.push(`matrix3d(${a1}, ${b1}, ${c1}, ${d1}, ${a2}, ${b2}, ${c2}, ${d2}, ${a3}, ${b3}, ${c3}, ${d3}, ${a4}, ${b4}, ${c4}, ${d4})`)
    return this
  }
  rotate (angle) {
    this.transform.push(`rotate(${angle}deg)`)
    return this
  }
  rotate3d (x, y, z, angle) {
    this.transform.push(`rotate3d(${x}, ${y}, ${z}, ${angle}deg)`)
    return this
  }
  rotateX (angle) {
    this.transform.push(`rotateX(${angle}deg)`)
    return this
  }
  rotateY (angle) {
    this.transform.push(`rotateY(${angle}deg)`)
    return this
  }
  rotateZ (angle) {
    this.transform.push(`rotateZ(${angle}deg)`)
    return this
  }
  scale (x, y) {
    this.transform.push(`scale(${x}, ${y})`)
    return this
  }
  scale3d (x, y, z) {
    this.transform.push(`scale3d(${x}, ${y}, ${z})`)
    return this
  }
  scaleX (scale) {
    this.transform.push(`scaleX(${scale})`)
    return this
  }
  scaleY (scale) {
    this.transform.push(`scaleY(${scale})`)
    return this
  }
  scaleZ (scale) {
    this.transform.push(`scaleZ(${scale})`)
    return this
  }
  skew (x, y) {
    this.transform.push(`skew(${x}, ${y})`)
    return this
  }
  skewX (angle) {
    this.transform.push(`skewX(${angle})`)
    return this
  }
  skewY (angle) {
    this.transform.push(`skewY(${angle})`)
    return this
  }
  translate (x, y) {
    [x, y] = this.transformUnit(x, y)
    this.transform.push(`translate(${x}, ${y})`)
    return this
  }
  translate3d (x, y, z) {
    [x, y, z] = this.transformUnit(x, y, z)
    this.transform.push(
      `translate3d(${x}, ${y}, ${z})`
    )
    return this
  }
  translateX (translate) {
    [translate] = this.transformUnit(translate)
    this.transform.push(`translateX(${translate})`)
    return this
  }
  translateY (translate) {
    [translate] = this.transformUnit(translate)
    this.transform.push(`translateY(${translate})`)
    return this
  }
  translateZ (translate) {
    [translate] = this.transformUnit(translate)
    this.transform.push(`translateZ(${translate})`)
    return this
  }
  opacity (value) {
    this.rules.push(`opacity: ${value}`)
    return this
  }
  backgroundColor (value) {
    this.rules.push(`background-color: ${value}`)
    return this
  }
  width (value) {
    [value] = this.transformUnit(value)
    this.rules.push(`width: ${value}`)
    return this
  }
  height (value) {
    [value] = this.transformUnit(value)
    this.rules.push(`height: ${value}`)
    return this
  }
  top (value) {
    [value] = this.transformUnit(value)
    this.rules.push(`top: ${value}`)
    return this
  }
  right (value) {
    [value] = this.transformUnit(value)
    this.rules.push(`right: ${value}`)
    return this
  }
  bottom (value) {
    [value] = this.transformUnit(value)
    this.rules.push(`bottom: ${value}`)
    return this
  }
  left (value) {
    [value] = this.transformUnit(value)
    this.rules.push(`left: ${value}`)
    return this
  }
  // 关键帧载入
  step (arg = {}) {
    const { DEFAULT } = this
    const {
      duration = DEFAULT.duration,
      delay = DEFAULT.delay,
      timingFunction = DEFAULT.timingFunction,
      transformOrigin = DEFAULT.transformOrigin
    } = arg
    // 生成一条 transition 动画
    this.steps.push(
      [
        this.rules.join(';'),
        this.transform.join(' '),
        `${TRANSFORM}-origin: ${transformOrigin}`,
        `transition: all ${duration}ms ${timingFunction} ${delay}ms`
      ]
        .filter(item => item !== '' && item !== `${TRANSFORM}:`)
        .join(';')
    )
    // 清空 rules 和 transform
    this.rules = []
    this.transform = [`${TRANSFORM}:`]
    return this
  }
  // 创建底层数据
  createAnimationData () {
    const animIndex = `taro-h5-poly-fill/${this.id}/create-animation__${this.animationMapCount++}`
    // 记录动画分几个 step
    this.animationMap[animIndex] = this.steps.length
    // 吐出 step
    this.steps.forEach((step, index) => {
      const selector = index === 0
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
    return this.createAnimationData()
  }
}

// h5 的 createAnimation
function createAnimation (...arg) {
  return new Animation(...arg)
}

export { createAnimation }
