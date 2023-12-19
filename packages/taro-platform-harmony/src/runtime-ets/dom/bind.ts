import { ObjectAssign } from '../utils'

import type { TaroAny } from '../utils'
import type { TaroElement, TaroScrollViewElement } from './element/element'

function convertToCamelCase(str: string) {
  return str.replace(new RegExp("/-(.)/g"), (_, char: string) => char.toUpperCase()).replace(new RegExp("/^\w/"), firstChar => firstChar.toUpperCase())
}

function bindAttributesCallback (node: TaroElement, attributeName: string, callback: Function) {
  if (!node) return

  node._nodeInfo.attributeCallback[attributeName]  = callback
}

export function bindScrollTo (node: TaroScrollViewElement) {
  bindAttributesCallback(node, 'scrollTo', () => {
    node.scroller.scrollTo({
      xOffset: node._attrs.scrollLeft || 0,
      yOffset: node._attrs.scrollTop || 0,
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
          animateTo(animateParams, () => {
            const transformOrigin: string = anim.transformOrigin

            if (transformOrigin) {
              const splitOrigin = transformOrigin.split(' ')
              Object.keys(anim.rule).forEach(key => {
                if (['scale', 'rotate'].includes(key)) {
                  anim.rule[key] = ObjectAssign(anim.rule[key], {
                    centerX: splitOrigin[0],
                    centerY: splitOrigin[1],
                  })
                }
              })
            }

            node._nodeInfo.overwriteStyle = anim.rule
            node.updateComponent()
          })
        })
      }
    }
  })
}

