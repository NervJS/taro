/**
 * @typedef {object} PrivateData
 * @property {EventTarget} eventTarget The event target.
 * @property {{type:string}} event The original event object.
 * @property {number} eventPhase The current event phase.
 * @property {EventTarget|null} currentTarget The current event target.
 * @property {boolean} canceled The flag to prevent default.
 * @property {boolean} stopped The flag to stop propagation.
 * @property {boolean} immediateStopped The flag to stop propagation immediately.
 * @property {Function|null} passiveListener The listener if the current listener is passive. Otherwise this is null.
 * @property {number} timeStamp The unix time.
 * @private
 */

/**
 * Private data for event wrappers.
 * @type {WeakMap<Event, PrivateData>}
 * @private
 */
const privateData = new WeakMap()

/**
 * Cache for wrapper classes.
 * @type {WeakMap<Object, Function>}
 * @private
 */
const wrappers = new WeakMap()

/**
 * Get private data.
 * @param {Event} event The event object to get private data.
 * @returns {PrivateData} The private data of the event.
 * @private
 */
function pd (event) {
  const retv = privateData.get(event)
  console.assert(
    retv != null,
    "'this' is expected an Event object, but got",
    event
  )
  return retv
}

/**
 * https://dom.spec.whatwg.org/#set-the-canceled-flag
 * @param data {PrivateData} private data.
 */
function setCancelFlag (data) {
  if (data.passiveListener != null) {
    if (
      typeof console !== 'undefined' &&
            typeof console.error === 'function'
    ) {
      console.error(
        'Unable to preventDefault inside passive event listener invocation.',
        data.passiveListener
      )
    }
    return
  }
  if (!data.event.cancelable) {
    return
  }

  data.canceled = true
  if (typeof data.event.preventDefault === 'function') {
    data.event.preventDefault()
  }
}

/**
 * @see https://dom.spec.whatwg.org/#interface-event
 * @private
 */
/**
 * The event wrapper.
 * @constructor
 * @param {EventTarget} eventTarget The event target of this dispatching.
 * @param {Event|{type:string}} event The original event to wrap.
 */
function Event (eventTarget, event) {
  privateData.set(this, {
    eventTarget,
    event,
    eventPhase: 2,
    currentTarget: eventTarget,
    canceled: false,
    stopped: false,
    immediateStopped: false,
    passiveListener: null,
    timeStamp: event.timeStamp || Date.now()
  })

  // https://heycam.github.io/webidl/#Unforgeable
  Object.defineProperty(this, 'isTrusted', { value: false, enumerable: true })

  // Define accessors
  const keys = Object.keys(event)
  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i]
    if (!(key in this)) {
      Object.defineProperty(this, key, defineRedirectDescriptor(key))
    }
  }
}

// Should be enumerable, but class methods are not enumerable.
Event.prototype = {
  /**
     * The type of this event.
     * @type {string}
     */
  get type () {
    return pd(this).event.type
  },

  /**
     * The target of this event.
     * @type {EventTarget}
     */
  get target () {
    return pd(this).eventTarget
  },

  /**
     * The target of this event.
     * @type {EventTarget}
     */
  get currentTarget () {
    return pd(this).currentTarget
  },

  /**
     * @returns {EventTarget[]} The composed path of this event.
     */
  composedPath () {
    const currentTarget = pd(this).currentTarget
    if (currentTarget == null) {
      return []
    }
    return [currentTarget]
  },

  /**
     * Constant of NONE.
     * @type {number}
     */
  get NONE () {
    return 0
  },

  /**
     * Constant of CAPTURING_PHASE.
     * @type {number}
     */
  get CAPTURING_PHASE () {
    return 1
  },

  /**
     * Constant of AT_TARGET.
     * @type {number}
     */
  get AT_TARGET () {
    return 2
  },

  /**
     * Constant of BUBBLING_PHASE.
     * @type {number}
     */
  get BUBBLING_PHASE () {
    return 3
  },

  /**
     * The target of this event.
     * @type {number}
     */
  get eventPhase () {
    return pd(this).eventPhase
  },

  /**
     * Stop event bubbling.
     * @returns {void}
     */
  stopPropagation () {
    const data = pd(this)

    data.stopped = true
    if (typeof data.event.stopPropagation === 'function') {
      data.event.stopPropagation()
    }
  },

  /**
     * Stop event bubbling.
     * @returns {void}
     */
  stopImmediatePropagation () {
    const data = pd(this)

    data.stopped = true
    data.immediateStopped = true
    if (typeof data.event.stopImmediatePropagation === 'function') {
      data.event.stopImmediatePropagation()
    }
  },

  /**
     * The flag to be bubbling.
     * @type {boolean}
     */
  get bubbles () {
    return Boolean(pd(this).event.bubbles)
  },

  /**
     * The flag to be cancelable.
     * @type {boolean}
     */
  get cancelable () {
    return Boolean(pd(this).event.cancelable)
  },

  /**
     * Cancel this event.
     * @returns {void}
     */
  preventDefault () {
    setCancelFlag(pd(this))
  },

  /**
     * The flag to indicate cancellation state.
     * @type {boolean}
     */
  get defaultPrevented () {
    return pd(this).canceled
  },

  /**
     * The flag to be composed.
     * @type {boolean}
     */
  get composed () {
    return Boolean(pd(this).event.composed)
  },

  /**
     * The unix time of this event.
     * @type {number}
     */
  get timeStamp () {
    return pd(this).timeStamp
  },

  /**
     * The target of this event.
     * @type {EventTarget}
     * @deprecated
     */
  get srcElement () {
    return pd(this).eventTarget
  },

  /**
     * The flag to stop event bubbling.
     * @type {boolean}
     * @deprecated
     */
  get cancelBubble () {
    return pd(this).stopped
  },
  set cancelBubble (value) {
    if (!value) {
      return
    }
    const data = pd(this)

    data.stopped = true
    if (typeof data.event.cancelBubble === 'boolean') {
      data.event.cancelBubble = true
    }
  },

  /**
     * The flag to indicate cancellation state.
     * @type {boolean}
     * @deprecated
     */
  get returnValue () {
    return !pd(this).canceled
  },
  set returnValue (value) {
    if (!value) {
      setCancelFlag(pd(this))
    }
  },

  /**
     * Initialize this event object. But do nothing under event dispatching.
     * @param {string} type The event type.
     * @param {boolean} [bubbles=false] The flag to be possible to bubble up.
     * @param {boolean} [cancelable=false] The flag to be possible to cancel.
     * @deprecated
     */
  initEvent () {
    // Do nothing.
  }
}

// `constructor` is not enumerable.
Object.defineProperty(Event.prototype, 'constructor', {
  value: Event,
  configurable: true,
  writable: true
})

// Ensure `event instanceof window.Event` is `true`.
if (typeof window !== 'undefined' && typeof window.Event !== 'undefined') {
  Object.setPrototypeOf(Event.prototype, window.Event.prototype)

  // Make association for wrappers.
  wrappers.set(window.Event.prototype, Event)
}

/**
 * Get the property descriptor to redirect a given property.
 * @param {string} key Property name to define property descriptor.
 * @returns {PropertyDescriptor} The property descriptor to redirect the property.
 * @private
 */
function defineRedirectDescriptor (key) {
  return {
    get () {
      return pd(this).event[key]
    },
    set (value) {
      pd(this).event[key] = value
    },
    configurable: true,
    enumerable: true
  }
}

/**
 * Get the property descriptor to call a given method property.
 * @param {string} key Property name to define property descriptor.
 * @returns {PropertyDescriptor} The property descriptor to call the method property.
 * @private
 */
function defineCallDescriptor (key) {
  return {
    value () {
      const event = pd(this).event
      return event[key].apply(event, arguments)
    },
    configurable: true,
    enumerable: true
  }
}

/**
 * Define new wrapper class.
 * @param {Function} BaseEvent The base wrapper class.
 * @param {Object} proto The prototype of the original event.
 * @returns {Function} The defined wrapper class.
 * @private
 */
function defineWrapper (BaseEvent, proto) {
  const keys = Object.keys(proto)
  if (keys.length === 0) {
    return BaseEvent
  }

  /** CustomEvent */
  function CustomEvent (eventTarget, event) {
    BaseEvent.call(this, eventTarget, event)
  }

  CustomEvent.prototype = Object.create(BaseEvent.prototype, {
    constructor: { value: CustomEvent, configurable: true, writable: true }
  })

  // Define accessors.
  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i]
    if (!(key in BaseEvent.prototype)) {
      const descriptor = Object.getOwnPropertyDescriptor(proto, key)
      const isFunc = typeof descriptor.value === 'function'
      Object.defineProperty(
        CustomEvent.prototype,
        key,
        isFunc
          ? defineCallDescriptor(key)
          : defineRedirectDescriptor(key)
      )
    }
  }

  return CustomEvent
}

/**
 * Get the wrapper class of a given prototype.
 * @param {Object} proto The prototype of the original event to get its wrapper.
 * @returns {Function} The wrapper class.
 * @private
 */
function getWrapper (proto) {
  if (proto == null || proto === Object.prototype) {
    return Event
  }

  let wrapper = wrappers.get(proto)
  if (wrapper == null) {
    wrapper = defineWrapper(getWrapper(Object.getPrototypeOf(proto)), proto)
    wrappers.set(proto, wrapper)
  }
  return wrapper
}

/**
 * Wrap a given event to management a dispatching.
 * @param {EventTarget} eventTarget The event target of this dispatching.
 * @param {Object} event The event to wrap.
 * @returns {Event} The wrapper instance.
 * @private
 */
export function wrapEvent (eventTarget, event) {
  const Wrapper = getWrapper(Object.getPrototypeOf(event))
  return new Wrapper(eventTarget, event)
}

/**
 * Get the immediateStopped flag of a given event.
 * @param {Event} event The event to get.
 * @returns {boolean} The flag to stop propagation immediately.
 * @private
 */
export function isStopped (event) {
  return pd(event).immediateStopped
}

/**
 * Set the current event phase of a given event.
 * @param {Event} event The event to set current target.
 * @param {number} eventPhase New event phase.
 * @returns {void}
 * @private
 */
export function setEventPhase (event, eventPhase) {
  pd(event).eventPhase = eventPhase
}

/**
 * Set the current target of a given event.
 * @param {Event} event The event to set current target.
 * @param {EventTarget|null} currentTarget New current target.
 * @returns {void}
 * @private
 */
export function setCurrentTarget (event, currentTarget) {
  pd(event).currentTarget = currentTarget
}

/**
 * Set a passive listener of a given event.
 * @param {Event} event The event to set current target.
 * @param {Function|null} passiveListener New passive listener.
 * @returns {void}
 * @private
 */
export function setPassiveListener (event, passiveListener) {
  pd(event).passiveListener = passiveListener
}
