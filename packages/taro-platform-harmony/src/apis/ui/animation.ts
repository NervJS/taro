import matrix4 from '@ohos.matrix4'

import { unsupport } from '../utils'

import type Taro from '@tarojs/api'

interface IAnimationAttr {
  duration: number
  delay: number
  timingFunction: string
  transformOrigin: string
}

type TStep = {
  delay: number
  duration: number
  timingFunction: string
  transformOrigin: string
  rule: TRule
}

type TRule = Record<string, any>

export class Animation implements Taro.Animation {

  unit: string
  DEFAULT: IAnimationAttr

  // 组合动画
  steps: TStep[] = []
  // 属性组合
  rule: TRule = {}

  constructor({
    duration = 400,
    delay = 0,
    timingFunction = 'linear',
    transformOrigin = '50% 50% 0',
    unit = 'px'
  }: Taro.createAnimation.Option = {}) {
    this.unit = unit
    this.setDefault(duration, delay, timingFunction, transformOrigin)
  }

  // 设置默认值
  setDefault (duration, delay, timingFunction, transformOrigin) {
    this.DEFAULT = { duration, delay, timingFunction, transformOrigin }
  }

  export (): { actions: any[] } {
    const actions = this.steps.slice()
    this.steps = []
    this.rule = {}
    return {
      actions
    }
  }

  step (arg: Partial<IAnimationAttr> = {}): Taro.Animation {
    const { DEFAULT } = this
    const {
      duration = DEFAULT.duration,
      delay = DEFAULT.delay,
      timingFunction = DEFAULT.timingFunction,
      transformOrigin = DEFAULT.transformOrigin
    } = arg
    this.steps.push({
      duration,
      delay,
      timingFunction,
      transformOrigin,
      rule: Object.assign({}, this.rule)
    })
    return this
  }

  matrix (a: number, b: number, c: number, d: number, tx: number, ty: number): Taro.Animation {
    this.rule.transform = matrix4.init([a, b, c, d, tx, ty])
    return this
  }

  matrix3d (a1: number, b1: number, c1: number, d1: number, a2: number, b2: number, c2: number, d2: number, a3: number, b3: number, c3: number, d3: number, a4: number, b4: number, c4: number, d4: number): Taro.Animation {
    this.rule.transform = matrix4.init([a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3, a4, b4, c4, d4])
    return this
  }

  rotate (angle: number): Taro.Animation {
    this.rule.rotate = { x: 0, y: 0, z: 1, angle }
    return this
  }

  rotate3d (x: number, y?: number | undefined, z?: number | undefined, angle?: number | undefined): Taro.Animation {
    this.rule.rotate = { x, y, z, angle }
    return this
  }

  rotateX (angle: number): Taro.Animation {
    this.rule.rotate = { x: 1, y: 0, z: 0, angle }
    return this
  }

  rotateY (angle: number): Taro.Animation {
    this.rule.rotate = { x: 0, y: 1, z: 0, angle }
    return this
  }

  rotateZ (angle: number): Taro.Animation {
    this.rule.rotate = { x: 0, y: 0, z: 1, angle }
    return this
  }

  scale (sx: number, sy?: number | undefined): Taro.Animation {
    this.rule.scale = { x: sx, y: sy }
    return this
  }

  scale3d (sx: number, sy: number, sz: number): Taro.Animation {
    this.rule.scale = { x: sx, y: sy, z: sz }
    return this
  }

  scaleX (scale: number): Taro.Animation {
    this.rule.scale = { x: scale }
    return this
  }

  scaleY (scale: number): Taro.Animation {
    this.rule.scale = { y: scale }
    return this
  }

  scaleZ (scale: number): Taro.Animation {
    this.rule.scale = { z: scale }
    return this
  }

  skew (ax: number, ay: number): Taro.Animation {
    this.rule.skew = { x: ax, y: ay }
    return this
  }

  skewX (angle: number): Taro.Animation {
    this.rule.skew = { x: angle }
    return this
  }

  skewY (angle: number): Taro.Animation {
    this.rule.skew = { y: angle }
    return this
  }

  translate (tx?: number | undefined, ty?: number | undefined): Taro.Animation {
    this.rule.translate = { x: tx, y: ty }
    return this
  }

  translate3d (tx?: number | undefined, ty?: number | undefined, tz?: number | undefined): Taro.Animation {
    this.rule.translate = { x: tx, y: ty, z: tz }
    return this
  }

  translateX (translation: number): Taro.Animation {
    this.rule.translate = { x: translation }
    return this
  }

  translateY (translation: number): Taro.Animation {
    this.rule.translate = { y: translation }
    return this
  }

  translateZ (translation: number): Taro.Animation {
    this.rule.translate = { z: translation }
    return this
  }

  opacity (value: number): Taro.Animation {
    this.rule.opacity = value
    return this
  }

  backgroundColor (value: string): Taro.Animation {
    this.rule.backgroundColor = value
    return this
  }

  width (value: string | number): Taro.Animation {
    this.rule.size = {
      ...this.rule.size,
      width: value
    }
    return this
  }

  height (value: string | number): Taro.Animation {
    this.rule.size = {
      ...this.rule.size,
      height: value
    }
    return this
  }

  left (value: string | number): Taro.Animation {
    unsupport('animation.left:' + value)
    return this
  }

  right (value: string | number): Taro.Animation {
    unsupport('animation.right:' + value)
    return this
  }

  top (value: string | number): Taro.Animation {
    unsupport('animation.top:' + value)
    return this
  }

  bottom (value: string | number): Taro.Animation {
    unsupport('animation.bottom:' + value)
    return this
  }
}
