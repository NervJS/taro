import { mergeReconciler, Shortcuts } from '@tarojs/shared'
import {
  isHtmlTags,
  getMappedType,
  getAttrMapFn,
  ensureHtmlClass,
  ensureRect,
  mapNameByContion
} from './utils'

interface AttrPayload {
  path: string
  value: any
}

const hostConfig = {
  modifyHydrateData (data: Record<string, any>) {
    const nodeName = data[Shortcuts.NodeName]
    if (!isHtmlTags(nodeName)) return

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

  modifySetAttrPayload (element, key: string, payload: AttrPayload) {
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
      payload.value = ensureHtmlClass(nodeName, payload.value)
    } else if (key === Shortcuts.Style || key === 'width' || key === 'height') {
      payload.path = `${_path}.${Shortcuts.Style}`
      payload.value = ensureRect(props, element.style.cssText)
    }
  },

  modifyRmAttrPayload (element, key: string, payload: AttrPayload) {
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
      payload.value = ensureHtmlClass(nodeName, payload.value)
    } else if (key === Shortcuts.Style || key === 'width' || key === 'height') {
      payload.path = `${_path}.${Shortcuts.Style}`
      payload.value = ensureRect(props, element.style.cssText)
    }
  },

  modifyAddEventType (node, type) {
    if (!isHtmlTags(node.nodeName)) return
    if (type === 'click') {
      Object.defineProperty(node.__handlers, 'click', {
        enumerable: true,
        configurable: true,
        get () {
          return node.__handlers.tap
        },
        set (val) {
          node.__handlers.tap = val
        }
      })
    }
  }
}

mergeReconciler(hostConfig)
