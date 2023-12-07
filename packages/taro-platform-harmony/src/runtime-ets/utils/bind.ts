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

