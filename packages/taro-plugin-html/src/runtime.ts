import { isHasExtractProp, TaroElement } from '@tarojs/runtime'
import { hooks, Shortcuts, toCamelCase, warn } from '@tarojs/shared'

import { blockElements } from './constant'
import {
  defineMappedProp,
  ensureHtmlClass,
  ensureRect,
  getAttrMapFn,
  getMappedType,
  isHtmlTags,
  mapNameByContion
} from './utils'

hooks.tap('modifyHydrateData', (data, node) => {
  const nodeName = data[Shortcuts.NodeName]
  if (!isHtmlTags(nodeName)) return

  process.env.NODE_ENV !== 'production' && warn(data[Shortcuts.NodeName] === 'select', '请使用 Picker 组件代替 <select>')

  // map nodeName
  data[Shortcuts.NodeName] = getMappedType(nodeName, data, node)

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

  if (blockElements.has(element.nodeName) && process.env.TARO_ENV !== 'swan') {
    const viewAlias = componentsAlias.view._num
    const staticViewAlias = componentsAlias['static-view']._num
    const catchViewAlias = componentsAlias['catch-view']._num
    const clickViewAlias = componentsAlias['click-view']._num
    const qualifiedNameInCamelCase = toCamelCase(key)
    const dataPath = `${_path}.${Shortcuts.NodeName}`
    if (qualifiedNameInCamelCase === 'catchMove') {
      // catchMove = true: catch-view
      // catchMove = false: view or click-view or static-view
      element.enqueueUpdate({
        path: dataPath,
        value: payload.value ? catchViewAlias : (
          element.isOnlyClickBinded() && !isHasExtractProp(element) ? clickViewAlias : (element.isAnyEventBinded() ? viewAlias : staticViewAlias)
        )
      })
    } else if (isHasExtractProp(element) && !element.isAnyEventBinded()) {
      // pure-view => static-view
      // static-view => static-view 因为没有办法分辨之前是不是 pure，所以就算之前是 static 也需要 setData
      element.enqueueUpdate({
        path: dataPath,
        value: staticViewAlias
      })
    }
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

  if (blockElements.has(element.nodeName) && process.env.TARO_ENV !== 'swan') {
    const viewAlias = componentsAlias.view._num
    const staticViewAlias = componentsAlias['static-view']._num
    const pureViewAlias = componentsAlias['pure-view']._num
    const clickViewAlias = componentsAlias['click-view']._num
    const qualifiedNameInCamelCase = toCamelCase(key)
    const dataPath = `${_path}.${Shortcuts.NodeName}`
    if (qualifiedNameInCamelCase === 'catchMove') {
      // catch-view => view or click-view or static-view or pure-view
      element.enqueueUpdate({
        path: dataPath,
        value: element.isOnlyClickBinded() && !isHasExtractProp(element) ? clickViewAlias : (element.isAnyEventBinded() ? viewAlias : (isHasExtractProp(element) ? staticViewAlias : pureViewAlias))
      })
    } else if (!isHasExtractProp(element)) {
      // static-view => pure-view
      // pure-view => pure-view 因为没有办法分辨之前是不是 pure，所以就算之前是 pure 也需要 setData
      element.enqueueUpdate({
        path: dataPath,
        value: pureViewAlias
      })
    }
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

hooks.tap('modifyAddEventListener', (element, sideEffect, getComponentsAlias) => {
  // 如果是从没有事件绑定到有事件绑定，且是 block 元素，则转换为 view
  if (blockElements.has(element.nodeName) && sideEffect !== false && !element.isAnyEventBinded()) {
    const componentsAlias = getComponentsAlias()
    const alias = componentsAlias.view._num
    element.enqueueUpdate({
      path: `${element._path}.${Shortcuts.NodeName}`,
      value: alias
    })
  }
})

hooks.tap('modifyRemoveEventListener', (element, sideEffect, getComponentsAlias) => {
  // 如果已没有绑定事件，且是 block 元素，则转换为 static-view 或 pure-view
  if (process.env.TARO_ENV !== 'swan' && blockElements.has(element.nodeName) && sideEffect !== false && !element.isAnyEventBinded()) {
    const componentsAlias = getComponentsAlias()
    const value = isHasExtractProp(element) ? 'static-view' : 'pure-view'
    const valueAlias = componentsAlias[value]._num
    element.enqueueUpdate({
      path: `${element._path}.${Shortcuts.NodeName}`,
      value: valueAlias
    })
  }
})
