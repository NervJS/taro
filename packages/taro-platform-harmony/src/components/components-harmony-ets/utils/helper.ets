import { isUndefined } from '@tarojs/shared'
import { bindAttributesCallback } from '@tarojs/runtime'

import type { TaroElement } from '@tarojs/runtime'
import type { Func } from '@tarojs/runtime/dist/runtime.esm'

export function bindInstanceToNode (node: TaroElement, instance: object) {
  if (!node) return

  // @ts-ignore
  node._instance = instance

  // 触发appear，让node监听到TaroNode已经和ete自定义组件绑定上
  // @ts-ignore
  node.resolveAppear?.()  // #text node节点没有实现该方法
}

export function bindScrollTo (node: TaroElement, instance: object) {
  bindAttributesCallback(node, 'scrollTo', () => {
    instance.scroller.scrollTo({
      xOffset: node._attrs.scrollLeft || 0,
      yOffset: node._attrs.scrollTop || 0,
    })
  })
}

export function bindFocus (node: TaroElement) {
  bindAttributesCallback(node, 'focus', () => {
    focusControl.requestFocus(node._nid) 
  })
}

// 动画绑定
export function bindAnimation (node: TaroElement, animationCb: (val: Record<string, any>) => void) {
  bindAttributesCallback(node, 'animation', async (animation) => {
    if (animation && animation.actions) {
      for (let i = 0; i < animation.actions.length; i++) {
        const anim = animation.actions[i]
        // 动画队列
        await new Promise(resolve => {
          let timingFunction = anim.timingFunction
          const animateParams = {
            duration: anim.duration,
            delay: anim.delay,
            tempo: 1,
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
            animationCb(anim.rule)
          })
        })
      }
    }
  })
}

export const parseStyles = (styles = ''): { [key: string]: string } => {
  return styles
    .split(';')
    .filter((style) => style.split(':').length === 2)
    .map((style) => [
    style.split(':')[0].trim().replace(/-./g, c => c.substring(1).toUpperCase()),
    style.split(':')[1].trim()
    ])
    .reduce((styleObj, style) => ({
      ...styleObj,
      [style[0]]: style[1],
    }), {})
}

export function convertVP2PX (value: number) {
  return Math.ceil(value / 384 * 750)
}

export function shouldBindEvent (cb: Func, node: TaroElement, eventNames: string[], disabled = false) {
  if (!node || node._attrs?.disabled || disabled) return null

  const listeners = Object.keys(node.__listeners || {})
  if (listeners.every(e => !eventNames.includes(e))) return null

  return cb
}

function convertToCamelCase(str) {
  return str.replace(/-(.)/g, (_, char) => char.toUpperCase()).replace(/^\w/, firstChar => firstChar.toUpperCase());
}

export function getNodeAttributeOrNull (node: TaroElement, key: string) {
  const value = node?._attrs?.[key]
  const isValueExist = !isUndefined(value)

  return isValueExist ? value : null
}

export function initComponentNodeInfo (component: any, node: TaroElement) {
  component.nodeInfoMap[node._nid] = {}
  component.nodeInfoMap[node._nid].eventMap = {}
  component.nodeInfoMap[node._nid].promiseMap = {}
  component.nodeInfoMap[node._nid].attributeCallback = {}
}

export { getNormalAttributes, getFontAttributes, transformW3CToHarmonyInStyle } from './styles'
