import { FormElement } from '@tarojs/runtime'

function isCheckable (elem: FormElement) {
  const type = elem.type
  const nodeName = elem.nodeName

  return (
    nodeName &&
    nodeName.toLowerCase() === 'input' &&
    (type === 'checkbox' || type === 'radio')
  )
}

function getTracker (node) {
  return node._valueTracker
}

function detachTracker (node) {
  node._valueTracker = null
}

// 之所以单独创建一个 tacker，是为了统一监听不同 type 的 input 值
// 比如 type=checkbox 或者 type=radio，就需要监听 checked，而不是 value
// 虽然目前还未实现 checkbox 和 radio 的 finishEventHandle，但后续不好说，所以先统一和 react 一样的写法
// 需要特别注意的是，tracker 初始化时的值为 node 的初始值，但后续会变更为事件的 detail.value 值
function trackValueOnNode (node: any) {
  const valueField = isCheckable(node) ? 'checked' : 'value'
  const descriptor = Object.getOwnPropertyDescriptor(
    node.constructor.prototype,
    valueField,
  )

  let currentValue = '' + node[valueField]

  if (
    node.hasOwnProperty(valueField) ||
    typeof descriptor === 'undefined' ||
    typeof descriptor.get !== 'function' ||
    typeof descriptor.set !== 'function'
  ) {
    return
  }

  const { get, set } = descriptor

  Object.defineProperty(node, valueField, {
    configurable: true,
    enumerable: descriptor.enumerable,
    get: function () {
      return get.call(this)
    },
    set: function (value) {
      currentValue = '' + value
      set.call(this, value)
    },
  })

  const tracker = {
    getValue () {
      return currentValue
    },
    setValue (value) {
      currentValue = '' + value
    },
    stopTracking () {
      detachTracker(node)
      delete node[valueField]
    },
  }
  return tracker
}

export function track (node) {
  if (getTracker(node)) {
    return
  }

  node._valueTracker = trackValueOnNode(node)
}

export function updateValueIfChanged (node, nextValue: string) {
  if (!node) {
    return false
  }

  const tracker = getTracker(node)

  if (!tracker) {
    return true
  }

  const lastValue = tracker.getValue()

  if (nextValue !== lastValue) {
    tracker.setValue(nextValue)
    return true
  }
  return false
}

export function stopTracking (node) {
  const tracker = getTracker(node)
  if (tracker) {
    tracker.stopTracking()
  }
}
