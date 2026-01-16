import { hooks, Shortcuts, toCamelCase } from '@tarojs/shared'

import {
  CATCH_VIEW,
  CATCHMOVE,
  CLASS,
  CLICK_VIEW,
  COMPILE_MODE,
  ID,
  PURE_VIEW,
  STYLE,
  VIEW
} from './constants'
import { getComponentsAlias, isComment, isHasExtractProp, isText } from './utils'

import type { TaroElement } from './dom/element'
import type { TaroText } from './dom/text'
import type { MiniData, MiniElementData } from './interface'

let SPECIAL_NODES
let componentsAlias

/**
 * React also has a fancy function's name for this: `hydrate()`.
 * You may have been heard `hydrate` as a SSR-related function,
 * actually, `hydrate` basicly do the `render()` thing, but ignore some properties,
 * it's a vnode traverser and modifier: that's exactly what Taro's doing in here.
 */
export function hydrate (node: TaroElement | TaroText): MiniData {
  // 初始化 componentsAlias
  componentsAlias ||= getComponentsAlias()

  // 初始化 SPECIAL_NODES
  SPECIAL_NODES ||= hooks.call('getSpecialNodes')!

  const nodeName = node.nodeName
  let compileModeName = null

  if (isText(node)) {
    return {
      sid: node.sid,
      [Shortcuts.Text]: node.nodeValue,
      [Shortcuts.NodeName]: componentsAlias[nodeName]?._num || '8'
    }
  }

  const data: MiniElementData = {
    [Shortcuts.NodeName]: nodeName,
    sid: node.sid
  }

  if (node.uid !== node.sid) {
    data.uid = node.uid
  }

  if (SPECIAL_NODES.indexOf(nodeName) > -1) {
    if (!node.isAnyEventBinded()) {
      data[Shortcuts.NodeName] = `static-${nodeName}`
      if (nodeName === VIEW && !isHasExtractProp(node)) {
        data[Shortcuts.NodeName] = PURE_VIEW
      }
    }

    if (nodeName === VIEW && node.isOnlyClickBinded() && !isHasExtractProp(node)) {
      data[Shortcuts.NodeName] = CLICK_VIEW
    }
  }

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
    if (
      process.env.TARO_ENV !== 'swan' &&
      nodeName === VIEW &&
      propInCamelCase === CATCHMOVE &&
      props[prop] !== false
    ) {
      data[Shortcuts.NodeName] = CATCH_VIEW
    }
    if (propInCamelCase === COMPILE_MODE) {
      compileModeName = props[prop]
    }
  }

  // Children
  data[Shortcuts.Childnodes] = node.childNodes.filter(node => !isComment(node)).map(hydrate)

  if (node.className !== '') {
    data[Shortcuts.Class] = node.className
  }

  const cssText = node.cssText
  if (cssText !== '' && nodeName !== 'swiper-item') {
    data[Shortcuts.Style] = cssText
  }

  hooks.call('modifyHydrateData', data, node)

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

  if (compileModeName !== null) {
    data[Shortcuts.NodeName] = compileModeName
  }

  const resData = hooks.call('transferHydrateData', data, node, componentAlias)

  return resData || data
}
