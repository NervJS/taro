import { ObjectAssign } from '../utils'

import type { TaroAny } from '../utils'
import type { TaroElement, TaroScrollViewElement } from './element'

function convertToCamelCase(str: string) {
  return str.replace(new RegExp('/-(.)/g'), (_, char: string) => char.toUpperCase()).replace(new RegExp('/^\\w/'), firstChar => firstChar.toUpperCase())
}

function bindAttributesCallback (node: TaroElement, attributeName: string, callback: TaroAny) {
  if (!node) return

  node._nodeInfo.attributeCallback[attributeName] = callback
}

export function bindScrollTo (node: TaroScrollViewElement) {
  bindAttributesCallback(node, 'scrollTo', () => {
    // 获取当前滚动容器的滚动信息
    const currentOffset = node.scroller?.currentOffset()
    const currentScrollTop = currentOffset?.yOffset ?? 0
    const currentScrollLeft = currentOffset?.xOffset ?? 0

    // 处理将要设置的滚动信息，把js提供的px数字转成harmony接收的vp数字
    const nextScrollTop = node._attrs.scrollTop ? px2vp(node._attrs.scrollTop) : 0
    const nextScrollLeft = node._attrs.scrollLeft ? px2vp(node._attrs.scrollLeft) : 0

    // 当top和left前后差值都小于误差精度是不做处理
    if (Math.abs(nextScrollTop - currentScrollTop) < 0.5 &&
      Math.abs(nextScrollLeft - currentScrollLeft) < 0.5) {
      return
    }

    node.scroller.scrollTo({
      xOffset: nextScrollLeft,
      yOffset: nextScrollTop,
    })
  })
}

export function bindFocus (node: TaroElement) {
  bindAttributesCallback(node, 'focus', () => {
    // TODO: ETS转TS
    // focusControl.requestFocus(node._nid)
  })
}

export function bindAnimation (node: TaroElement) {
  bindAttributesCallback(node, 'animation', async (animation: TaroAny) => {
    if (animation && animation.actions) {
      for (let i = 0; i < animation.actions.length; i++) {
        const anim: TaroAny = animation.actions[i]
        // 动画队列
        await new Promise<TaroAny>((resolve: TaroAny) => {
          const timingFunction: TaroAny = anim.timingFunction
          const animateParams: AnimateParam = {
            duration: anim.duration,
            delay: anim.delay,
            tempo: 1,
            // TODO: ETS转TS
            playMode: PlayMode.Normal,
            iterations: 1,
            onFinish: resolve
          }
          if (timingFunction === 'step-start') {
            animateParams.tempo = 0
          } else if (timingFunction === 'step-end') {
            animateParams.tempo = 0
            animateParams.delay = anim.duration + anim.delay
            animateParams.duration = 0
          }
          animateParams.curve = Curve[convertToCamelCase(timingFunction)] || Curve.EaseInOut
          node._instance.getUIContext()?.animateTo(animateParams, () => {
            const transformOrigin: string = anim.transformOrigin
            if (transformOrigin) {
              const splitOrigin = transformOrigin.split(' ')
              Object.keys(anim.rule).forEach(key => {
                if (key === 'transform') {
                  const transform = anim.rule[key]
                  Object.keys(transform).forEach(transformKey => {
                    if (['scale', 'rotate'].includes(transform[transformKey])) {
                      transform[transformKey] = ObjectAssign(transform[transformKey], {
                        centerX: splitOrigin[0],
                        centerY: splitOrigin[1],
                      })
                    }
                  })
                }
              })
            }
            node._instance.overwriteStyle = anim.rule
          })
        })
      }
    }
  })
}
