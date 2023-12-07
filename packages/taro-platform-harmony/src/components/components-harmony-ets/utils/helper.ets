import { getNormalAttributes, getFontAttributes, transformW3CToHarmonyInStyle } from './styles'

import type { TaroAny, TaroElement } from '@tarojs/runtime'
import { bindAttributesCallback } from '@tarojs/runtime'
import type { Func } from '@tarojs/runtime/dist/runtime.esm'

export const parseStyles = (styles = ''): Record<string, string> => {
  const styleObj: Record<string, string> = {}
  styles
    .split(';')
    .filter((style) => style.split(':').length === 2)
    .map((style) => [
    style.split(':')[0].trim().replace(new RegExp("/-./g"), c => c.substring(1).toUpperCase()),
    style.split(':')[1].trim()
    ])
    .forEach((style) => {
      const key = style[0]
      const value = style[1]
      styleObj[key] = value
    })
  return styleObj
}


export function shouldBindEvent (cb: Func, node: TaroElement, eventNames: string[], disabled = false) {
  if (!node || node._attrs?.disabled || disabled) return null
  if (!node.__listeners) {
    return null
  }
  const listeners = Object.keys(node.__listeners)
  if (listeners.every(e => !eventNames.includes(e))) return null
  return cb
}

export function getNodeThresholds (node: TaroElement): number[] | null {
  if (!node) return null

  const id = node._nid
  const instance: TaroAny = node._instance

  return instance?.nodeInfoMap?.[id]?.thresholds || null
}

function convertToCamelCase(str) {
  return str.replace(/-(.)/g, (_, char) => char.toUpperCase()).replace(/^\w/, firstChar => firstChar.toUpperCase())
}

// 动画绑定
export function bindAnimation (node: TaroElement) {
  bindAttributesCallback(node, 'animation', async (animation) => {
    if (animation && animation.actions) {
      for (let i = 0; i < animation.actions.length; i++) {
        const anim = animation.actions[i]
        // 动画队列
        await new Promise(resolve => {
          const timingFunction = anim.timingFunction
          const animateParams: any = {
            duration: anim.duration,
            delay: anim.delay,
            tempo: 1,
            // TODO: ETS转TS
            // playMode: PlayMode.Normal,
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
            const component = node._instance
            const transformOrigin = anim.transformOrigin
          
            if (transformOrigin) {
              const splitOrigin = transformOrigin.split(' ')
              Object.keys(anim.rule).forEach(key => {
                if (['scale', 'rotate'].includes(key)) {
                  Object.assign(anim.rule[key], {
                    centerX: splitOrigin[0],
                    centerY: splitOrigin[1],
                  })
                }
              })
            }
          
            component.nodeInfoMap[node._nid].overwriteStyle = anim.rule
            node.updateComponent()
          })
        })
      }
    }
  })
}


export { getNormalAttributes, getFontAttributes, transformW3CToHarmonyInStyle }
