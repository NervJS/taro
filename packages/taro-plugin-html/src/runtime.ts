/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { TaroElement } from '@tarojs/runtime'
import { hooks, Shortcuts, toCamelCase, warn } from '@tarojs/shared'

import {
  defineMappedProp,
  ensureHtmlClass,
  ensureRect,
  getAttrMapFn,
  getMappedType,
  isHtmlTags,
  mapNameByContion
} from './utils'

hooks.tap('modifyHydrateData', data => {
  const nodeName = data[Shortcuts.NodeName]
  if (!isHtmlTags(nodeName)) return

  process.env.NODE_ENV !== 'production' && warn(data[Shortcuts.NodeName] === 'select', '请使用 Picker 组件代替 <select>')

  // map nodeName
  data[Shortcuts.NodeName] = getMappedType(nodeName, data)

  // map attr Key/Value
  const attrMapFn = getAttrMapFn(nodeName)
  if (attrMapFn) {
    for (const key in data) {
      const value = data[key]
      const [mapKey, mapValue] = attrMapFn(key, value, data)
      if (key !== mapKey) {
        delete data[key]
        data[mapKey] = mapValue
      } else if (value !== mapValue) {
        data[key] = mapValue
      }
    }
  }

  if (nodeName === 'br') {
    data[Shortcuts.Childnodes] = [{
      [Shortcuts.NodeName]: '#text',
      v: '\n'
    }]
  }

  data[Shortcuts.Class] = ensureHtmlClass(nodeName, data[Shortcuts.Class])
  data[Shortcuts.Style] = ensureRect(data, data[Shortcuts.Style])
})

hooks.tap('modifySetAttrPayload', (element, key, payload, componentsAlias) => {
  const { nodeName, _path, props } = element
  if (!isHtmlTags(nodeName)) return

  // map nodeName
  mapNameByContion(nodeName, key, element, componentsAlias)

  const mapName = getMappedType(nodeName, props)
  const alias = componentsAlias[mapName]

  // map attr Key/Value
  const attrMapFn = getAttrMapFn(nodeName)
  if (attrMapFn) {
    const value = payload.value
    const [mapKey, mapValue] = attrMapFn(key, value, props)
    payload.path = `${_path}.${alias[mapKey] || mapKey}`
    payload.value = mapValue
  } else if (alias[key] && alias[key] !== key) {
    payload.path = `${_path}.${toCamelCase(alias[key])}`
  }

  if (key === Shortcuts.Class) {
    payload.value = ensureHtmlClass(nodeName, payload.value as string)
  } else if (key === Shortcuts.Style || key === 'width' || key === 'height') {
    payload.path = `${_path}.${Shortcuts.Style}`
    payload.value = ensureRect(props, element.style.cssText)
  }
})

hooks.tap('modifyRmAttrPayload', (element, key, payload, componentsAlias) => {
  const { nodeName, _path, props } = element
  if (!isHtmlTags(nodeName)) return

  // map nodeName
  mapNameByContion(nodeName, key, element, componentsAlias)

  const mapName = getMappedType(nodeName, props)
  const alias = componentsAlias[mapName]

  // map attr Key/Value
  const attrMapFn = getAttrMapFn(nodeName)
  if (attrMapFn) {
    const value = payload[key]
    const [mapKey] = attrMapFn(key, value, props)
    payload.path = `${_path}.${alias[mapKey] || mapKey}`
  } else if (alias[key] && alias[key] !== key) {
    payload.path = `${_path}.${toCamelCase(alias[key])}`
  }

  if (key === Shortcuts.Class) {
    payload.value = ensureHtmlClass(nodeName, payload.value as string)
  } else if (key === Shortcuts.Style || key === 'width' || key === 'height') {
    payload.path = `${_path}.${Shortcuts.Style}`
    payload.value = ensureRect(props, element.style.cssText)
  }
})

hooks.tap('onAddEvent', (type, _handler, _options, node) => {
  node = node as TaroElement
  if (!isHtmlTags(node.nodeName)) return
  if (type === 'click') {
    defineMappedProp(node.__handlers, type, 'tap')
  } else if (node.nodeName === 'input') {
    if (type === 'change') {
      if (node.props.type === 'checkbox' || node.props.type === 'radio') {
        defineMappedProp(node.__handlers, type, 'tap')
      } else {
        defineMappedProp(node.__handlers, type, 'input')
      }
    } else if (type === 'keypress') {
      defineMappedProp(node.__handlers, type, 'confirm')
    }
  }
})

hooks.tap('modifyTaroEvent', (event, element) => {
  const { nodeName, props } = element
  if (nodeName === 'input' && event.type === 'tap') {
    if (props.type === 'checkbox') {
      props.checked = !props.checked
    } else if (props.type === 'radio' && !props.checked) {
      props.checked = true
    }
    if (event.mpEvent) {
      const { currentTarget, target } = event.mpEvent
      currentTarget.checked = props.checked
      if (target.id === currentTarget.id) {
        target.checked = props.checked
      }
    }
  }
})
