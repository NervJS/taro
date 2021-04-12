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

interface AttrPayload {
  path: string
  value: any
}

const hostConfig = {
  modifyHydrateData (data: Record<string, any>) {
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
      defineMappedProp(node.__handlers, 'click', 'tap')
    } else if (type === 'change' && node.nodeName === 'input') {
      if (node.props.type === 'checkbox' || node.props.type === 'radio') {
        defineMappedProp(node.__handlers, 'change', 'tap')
      } else {
        defineMappedProp(node.__handlers, 'change', 'input')
      }
    }
  },

  modifyFormEvent (element, event) {
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
