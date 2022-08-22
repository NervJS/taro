import { isFunction, isString, Shortcuts } from '@tarojs/shared'

import {
  blockElements,
  inlineElements,
  specialElements,
  SpecialMaps
} from './constant'

export function isHtmlTags (nodeName: string): boolean {
  if (inlineElements.has(nodeName) || blockElements.has(nodeName) || specialElements.has(nodeName)) {
    return true
  }
  return false
}

export function getMappedType (nodeName: string, rawProps: Record<string, any>): string {
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
    return 'view'
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
