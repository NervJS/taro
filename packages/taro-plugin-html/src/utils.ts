import { isHasExtractProp } from '@tarojs/runtime'
import { isFunction, isString, Shortcuts, toCamelCase } from '@tarojs/shared'

import {
  blockElements,
  inlineElements,
  specialElements,
  SpecialMaps
} from './constant'

import type { TaroElement } from '@tarojs/runtime'

export function isHtmlTags (nodeName: string): boolean {
  if (inlineElements.has(nodeName) || blockElements.has(nodeName) || specialElements.has(nodeName)) {
    return true
  }
  return false
}

export function getMappedType (nodeName: string, rawProps: Record<string, any>, node?: TaroElement): string {
  if (inlineElements.has(nodeName)) {
    return 'text'
  } else if (specialElements.has(nodeName)) {
    const mapping = specialElements.get(nodeName)!
    if (isString(mapping)) {
      return mapping
    }
    const { mapName } = mapping
    return isFunction(mapName) ? mapName(rawProps) : mapName
  } else {
    // fix #15326
    if (process.env.TARO_ENV === 'swan') return 'view'
    if (node) {
      const { props } = node
      for (const prop in props) {
        const propInCamelCase = toCamelCase(prop)
        if (propInCamelCase === 'catchMove' && props[prop] !== false) {
          return 'catch-view'
        }
      }
    }
    if (!node) {
      return 'view'
    }
    if (node.isOnlyClickBinded() && !isHasExtractProp(node)) {
      return 'click-view'
    } else if (node.isAnyEventBinded()) {
      return 'view'
    } else if (isHasExtractProp(node)) {
      return 'static-view'
    } else {
      return 'pure-view'
    }
  }
}

export function getAttrMapFn (nodeName): SpecialMaps.MapAttrFn | undefined {
  const mapping = specialElements.get(nodeName)
  if (!isString(mapping)) {
    return mapping?.mapAttr
  }
}

function getMapNameByCondition (nodeName: string, attr: string, props: Record<string, any>): string | undefined {
  const mapping = specialElements.get(nodeName)
  if (!mapping || isString(mapping)) return

  const { mapName, mapNameCondition } = mapping
  if (!mapNameCondition) return

  if (mapNameCondition.indexOf(attr) > -1 && !isString(mapName)) {
    return mapName(props)
  }
}

export function mapNameByContion (nodeName: string, key: string, element: any, componentsAlias) {
  const mapName = getMapNameByCondition(nodeName, key, element.props)
  if (mapName) {
    const mapNameAlias = componentsAlias[mapName]._num
    element.enqueueUpdate({
      path: `${element._path}.${Shortcuts.NodeName}`,
      value: mapNameAlias
    })
  }
}

export function ensureHtmlClass (tagName: string, className = ''): string {
  const classList = className.split(' ')
  const htmlClass = `h5-${tagName}`
  if (classList.indexOf(htmlClass) === -1) {
    classList.unshift(htmlClass)
  }
  return classList.join(' ')
}

export function ensureRect (props: Record<string, any>, style = ''): string {
  let cssText = style
  const { width, height } = props
  if (width) {
    cssText = `width: ${width};${cssText}`
  }
  if (height) {
    cssText = `height: ${height};${cssText}`
  }
  return cssText
}

export function defineMappedProp (obj, propName, mapName) {
  Object.defineProperty(obj, propName, {
    enumerable: true,
    configurable: true,
    get () {
      return obj[mapName]
    },
    set (val) {
      obj[mapName] = val
    }
  })
}
