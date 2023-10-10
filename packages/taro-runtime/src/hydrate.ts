import { hooks, Shortcuts, toCamelCase } from '@tarojs/shared'

import {
  CATCH_VIEW,
  CATCHMOVE,
  CLASS,
  COMPILE_MODE,
  ID,
  PURE_VIEW,
  STYLE,
  VIEW
} from './constants'
import { getComponentsAlias, isComment, isHasExtractProp, isText } from './utils'

import type { TaroElement } from './dom/element'
import type { TaroText } from './dom/text'
import type { MiniData, MiniElementData, MiniTextData } from './interface'


let SPECIAL_NODES
let componentsAlias

function initConfig () {
  // 初始化 SPECIAL_NODES
  SPECIAL_NODES ||= hooks.call('getSpecialNodes')
  // 初始化 componentsAlias
  componentsAlias ||= getComponentsAlias()
}

function hydrateTextNode (node: TaroText): MiniTextData {
  return {
    [Shortcuts.Text]: node.nodeValue,
    [Shortcuts.NodeName]: componentsAlias[node.nodeName]?._num || '8'
  }
}

function hydrateElementNode (node: TaroElement): MiniElementData {
  const nodeName = node.nodeName
  let isCompileMode = false

  const data: MiniElementData = {
    [Shortcuts.NodeName]: nodeName,
    sid: node.sid
  }

  // NodeName
  if (!node.isAnyEventBinded() && SPECIAL_NODES.indexOf(nodeName) > -1) {
    data[Shortcuts.NodeName] = `static-${nodeName}`
    if (nodeName === VIEW && !isHasExtractProp(node)) {
      data[Shortcuts.NodeName] = PURE_VIEW
    }
  }

  // Id
  if (node.uid !== node.sid) {
    data.uid = node.uid
  }

  // Class
  if (node.className !== '') {
    data[Shortcuts.Class] = node.className
  }

  // Style
  const cssText = node.cssText
  if (cssText !== '' && nodeName !== 'swiper-item') {
    data[Shortcuts.Style] = cssText
  }

  // Attributes
  const { props } = node
  for (const prop in props) {
    const propInCamelCase = toCamelCase(prop)
    if (
      !prop.startsWith('data-') && // 在 node.dataset 的数据
      prop !== CLASS &&
      prop !== STYLE &&
      prop !== ID &&
      propInCamelCase !== CATCHMOVE &&
      propInCamelCase !== COMPILE_MODE
    ) {
      data[propInCamelCase] = props[prop]
    }
    if (nodeName === VIEW && propInCamelCase === CATCHMOVE && props[prop] !== false) {
      data[Shortcuts.NodeName] = CATCH_VIEW
    }
    if (propInCamelCase === COMPILE_MODE) {
      isCompileMode = true
    }
  }

  // Children
  data[Shortcuts.Childnodes] = node.childNodes.filter(n => !isComment(n)).map(hydrate)

  // Custom behavior
  hooks.call('modifyHydrateData', data)

  // Turn in alias
  const nn = data[Shortcuts.NodeName]
  const componentAlias = componentsAlias[nn]
  if (componentAlias) {
    data[Shortcuts.NodeName] = componentAlias._num
    for (const prop in data) {
      if (prop in componentAlias) {
        data[componentAlias[prop]] = data[prop]
        delete data[prop]
      }
    }
  }

  if (isCompileMode) {
    data[Shortcuts.NodeName] = props[COMPILE_MODE]
  }

  return data
}

/**
 * React also has a fancy function's name for this: `hydrate()`.
 * You may have been heard `hydrate` as a SSR-related function,
 * actually, `hydrate` basicly do the `render()` thing, but ignore some properties,
 * it's a vnode traverser and modifier: that's exactly what Taro's doing in here.
 */
export function hydrate (node: TaroElement | TaroText): MiniData {
  initConfig()

  if (isText(node)) {
    return hydrateTextNode(node)
  } else {
    return hydrateElementNode(node)
  }
}
