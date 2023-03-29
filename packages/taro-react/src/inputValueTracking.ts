function isCheckable (elem: HTMLInputElement) {
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
    get: function () {
      return get.call(this)
    },
    set: function (value) {
      currentValue = '' + value
      set.call(this, value)
    },
  })

  Object.defineProperty(node, valueField, {
    enumerable: descriptor.enumerable,
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

  // TODO: Once it's just Fiber we can move this to node._wrapperState
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
