/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { isFunction, isString, Shortcuts } from '@tarojs/shared'
import {
  inlineElements,
  blockElements,
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

export function mapNameByContion (nodeName: string, key: string, element: any) {
  const mapName = getMapNameByCondition(nodeName, key, element.props)
  if (mapName) {
    element.enqueueUpdate({
      path: `${element._path}.${Shortcuts.NodeName}`,
      value: mapName
    })
  }
}

export function ensureHtmlClass (tagName: string, className = ''): string {
  const classList = className.split(' ')
  const htmlClass = `h5-${tagName}`
  if (classList.indexOf(htmlClass) === -1) {
    classList.push(htmlClass)
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
