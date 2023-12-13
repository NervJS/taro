import { bindAttributesCallback } from './info'

import type { TaroElement } from '../dom/element/element'

// function convertToCamelCase(str) {
//   return str.replace(/-(.)/g, (_, char) => char.toUpperCase()).replace(/^\w/, firstChar => firstChar.toUpperCase())
// }

export function bindScrollTo (node: TaroElement) {
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

