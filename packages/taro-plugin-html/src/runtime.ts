import { mergeReconciler, Shortcuts, warn } from '@tarojs/shared'
import {
  isHtmlTags,
  getMappedType,
  getAttrMapFn,
  ensureHtmlClass,
  ensureRect,
  mapNameByContion,
  defineMappedProp
} from './utils'

import type { ModifyHydrateData, ModifyRmAttrPayload, ModifySetAttrPayload, ModifyTaroEvent, OnAddEvent, TaroElement } from '@tarojs/runtime'

interface IHostConfig {
  modifyHydrateData: ModifyHydrateData
  modifySetAttrPayload: ModifySetAttrPayload
  modifyRmAttrPayload: ModifyRmAttrPayload
  onAddEvent: OnAddEvent<TaroElement>
  modifyTaroEvent: ModifyTaroEvent
}

const hostConfig: IHostConfig = {
  modifyHydrateData (data) {
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
  },

  modifySetAttrPayload (element, key, payload) {
    const { nodeName, _path, props } = element
    if (!isHtmlTags(nodeName)) return

    // map nodeName
    mapNameByContion(nodeName, key, element)

    // map attr Key/Value
    const attrMapFn = getAttrMapFn(nodeName)
    if (attrMapFn) {
      const value = payload.value
      const [mapKey, mapValue] = attrMapFn(key, value, props)
      payload.path = `${_path}.${mapKey}`
      payload.value = mapValue
    }

    if (key === Shortcuts.Class) {
      payload.value = ensureHtmlClass(nodeName, payload.value as string)
    } else if (key === Shortcuts.Style || key === 'width' || key === 'height') {
      payload.path = `${_path}.${Shortcuts.Style}`
      payload.value = ensureRect(props, element.style.cssText)
    }
  },

  modifyRmAttrPayload (element, key, payload) {
    const { nodeName, _path, props } = element
    if (!isHtmlTags(nodeName)) return

    // map nodeName
    mapNameByContion(nodeName, key, element)

    // map attr Key/Value
    const attrMapFn = getAttrMapFn(nodeName)
    if (attrMapFn) {
      const value = payload[key]
      const [mapKey] = attrMapFn(key, value, props)
      payload.path = `${_path}.${mapKey}`
    }

    if (key === Shortcuts.Class) {
      payload.value = ensureHtmlClass(nodeName, payload.value as string)
    } else if (key === Shortcuts.Style || key === 'width' || key === 'height') {
      payload.path = `${_path}.${Shortcuts.Style}`
      payload.value = ensureRect(props, element.style.cssText)
    }
  },

  onAddEvent (type, _handler, _options, node) {
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
  },

  modifyTaroEvent (event, element) {
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
  }
}

mergeReconciler(hostConfig)
