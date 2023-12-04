import { bindAttributesCallback } from './info'

import type { TaroElement } from '../dom/element'

// function convertToCamelCase(str) {
//   return str.replace(/-(.)/g, (_, char) => char.toUpperCase()).replace(/^\w/, firstChar => firstChar.toUpperCase())
// }

export function bindInstanceToNode (node: TaroElement, instance: any) {
  if (!node) return

  // @ts-ignore
  node._instance = instance

  // 触发appear，让node监听到TaroNode已经和ete自定义组件绑定上
  // @ts-ignore
  node.resolveAppear?.() // #text node节点没有实现该方法
}

export function bindScrollTo (node: TaroElement, instance: any) {
  bindAttributesCallback(node, 'scrollTo', () => {
    instance.scroller.scrollTo({
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
          // TODO: ETS转TS
          // animateParams.curve = Curve[convertToCamelCase(timingFunction)] || Curve.EaseInOut
          // animateTo(animateParams, () => {
          //   const component = node._instance
          //   const transformOrigin = anim.transformOrigin
          //
          //   if (transformOrigin) {
          //     const splitOrigin = transformOrigin.split(' ')
          //     Object.keys(anim.rule).forEach(key => {
          //       if (['scale', 'rotate'].includes(key)) {
          //         Object.assign(anim.rule[key], {
          //           centerX: splitOrigin[0],
          //           centerY: splitOrigin[1],
          //         })
          //       }
          //     })
          //   }
          //
          //   component.nodeInfoMap[node._nid].overwriteStyle = anim.rule
          //   node.updateComponent()
          // })
        })
      }
    }
  })
}
