import {
  isStopped,
  setCurrentTarget,
  setEventPhase,
  setPassiveListener,
  wrapEvent
} from './event'
import { MpNode } from './node'

/**
* @typedef {object} ListenerNode
* @property {Function} listener
* @property {1|2|3} listenerType
* @property {boolean} passive
* @property {boolean} once
* @property {ListenerNode|null} next
* @private
*/

export const eventSource = new Map<string, MpNode>()

/**
* @type {WeakMap<object, Map<string, ListenerNode>>}
* @private
*/
const listenersMap = new WeakMap()

// Listener types
const CAPTURE = 1
const BUBBLE = 2
const ATTRIBUTE = 3

/**
* Check whether a given value is an object or not.
* @param {any} x The value to check.
* @returns {boolean} `true` if the value is an object.
*/
function isObject (x) {
  return x !== null && typeof x === 'object' // eslint-disable-line no-restricted-syntax
}

/**
* Get listeners.
* @param {EventTarget} eventTarget The event target to get.
* @returns {Map<string, ListenerNode>} The listeners.
* @private
*/
function getListeners (eventTarget) {
  const listeners = listenersMap.get(eventTarget)
  if (listeners == null) {
    throw new TypeError(
      "'this' is expected an EventTarget object, but got another value."
    )
  }
  return listeners
}

/**
* Get the property descriptor for the event attribute of a given event.
* @param {string} eventName The event name to get property descriptor.
* @returns {PropertyDescriptor} The property descriptor.
* @private
*/
function defineEventAttributeDescriptor (eventName) {
  return {
    get () {
      const listeners = getListeners(this)
      let node = listeners.get(eventName)
      while (node != null) {
        if (node.listenerType === ATTRIBUTE) {
          return node.listener
        }
        node = node.next
      }
      return null
    },

    set (listener) {
      if (typeof listener !== 'function' && !isObject(listener)) {
        listener = null // eslint-disable-line no-param-reassign
      }
      const listeners = getListeners(this)

      // Traverse to the tail while removing old value.
      let prev = null
      let node = listeners.get(eventName)
      while (node != null) {
        if (node.listenerType === ATTRIBUTE) {
          // Remove old value.
          if (prev !== null) {
            prev.next = node.next
          } else if (node.next !== null) {
            listeners.set(eventName, node.next)
          } else {
            listeners.delete(eventName)
          }
        } else {
          prev = node
        }

        node = node.next
      }

      // Add new value.
      if (listener !== null) {
        const newNode = {
          listener,
          listenerType: ATTRIBUTE,
          passive: false,
          once: false,
          next: null
        }
        if (prev === null) {
          listeners.set(eventName, newNode)
        } else {
          prev.next = newNode
        }
      }
    },
    configurable: true,
    enumerable: true
  }
}

/**
* Define an event attribute (e.g. `eventTarget.onclick`).
* @param {Object} eventTargetPrototype The event target prototype to define an event attrbite.
* @param {string} eventName The event name to define.
* @returns {void}
*/
function defineEventAttribute (eventTargetPrototype, eventName) {
  Object.defineProperty(
    eventTargetPrototype,
    `on${eventName}`,
    defineEventAttributeDescriptor(eventName)
  )
}

/**
* Define a custom EventTarget with event attributes.
* @param {string[]} eventNames Event names for event attributes.
* @returns {EventTarget} The custom EventTarget.
* @private
*/
// function defineCustomEventTarget (eventNames) {
//   /** CustomEventTarget */
//   function CustomEventTarget () {
//     EventTarget.call(this)
//   }

//   CustomEventTarget.prototype = Object.create(EventTarget.prototype, {
//     constructor: {
//       value: CustomEventTarget,
//       configurable: true,
//       writable: true
//     }
//   })

//   for (let i = 0; i < eventNames.length; ++i) {
//     defineEventAttribute(CustomEventTarget.prototype, eventNames[i])
//   }

//   return CustomEventTarget
// }

/**
* EventTarget.
*
* - This is constructor if no arguments.
* - This is a function which returns a CustomEventTarget constructor if there are arguments.
*
* For example:
*
*     class A extends EventTarget {}
*     class B extends EventTarget("message") {}
*     class C extends EventTarget("message", "error") {}
*     class D extends EventTarget(["message", "error"]) {}
*/
class EventTarget {
  public constructor () {
    /* eslint-disable consistent-return */
    if (this instanceof EventTarget) {
      listenersMap.set(this, new Map())
      return
    }
    throw new TypeError('Cannot call a class as a function')
  }

  /**
   * Add a given listener to this event target.
   * @param {string} eventName The event name to add.
   * @param {Function} listener The listener to add.
   * @param {boolean|{capture?:boolean,passive?:boolean,once?:boolean}} [options] The options for this listener.
   * @returns {void}
   */
  public addEventListener (eventName: string, listener, options) {
    if (listener == null) {
      return
    }
    if (typeof listener !== 'function' && !isObject(listener)) {
      throw new TypeError("'listener' should be a function or an object.")
    }

    const listeners = getListeners(this)
    const optionsIsObj = isObject(options)
    const capture = optionsIsObj
      ? Boolean(options.capture)
      : Boolean(options)
    const listenerType = capture ? CAPTURE : BUBBLE
    const newNode = {
      listener,
      listenerType,
      passive: optionsIsObj && Boolean(options.passive),
      once: optionsIsObj && Boolean(options.once),
      next: null
    }

    // Set it as the first node if the first node is null.
    let node = listeners.get(eventName)
    if (node === undefined) {
      listeners.set(eventName, newNode)
      return
    }

    // Traverse to the tail while checking duplication..
    let prev = null
    while (node != null) {
      if (
        node.listener === listener &&
        node.listenerType === listenerType
      ) {
        // Should ignore duplication.
        return
      }
      prev = node
      node = node.next
    }

    // Add it.
    prev.next = newNode
  }

  /**
   * Remove a given listener from this event target.
   * @param {string} eventName The event name to remove.
   * @param {Function} listener The listener to remove.
   * @param {boolean|{capture?:boolean,passive?:boolean,once?:boolean}} [options] The options for this listener.
   * @returns {void}
   */
  public removeEventListener (eventName, listener, options) {
    if (listener == null) {
      return
    }

    const listeners = getListeners(this)
    const capture = isObject(options)
      ? Boolean(options.capture)
      : Boolean(options)
    const listenerType = capture ? CAPTURE : BUBBLE

    let prev = null
    let node = listeners.get(eventName)
    while (node != null) {
      if (
        node.listener === listener &&
              node.listenerType === listenerType
      ) {
        if (prev !== null) {
          prev.next = node.next
        } else if (node.next !== null) {
          listeners.set(eventName, node.next)
        } else {
          listeners.delete(eventName)
        }
        return
      }

      prev = node
      node = node.next
    }
  }

  /**
   * Dispatch a given event.
   * @param {Event|{type:string}} event The event to dispatch.
   * @returns {boolean} `false` if canceled.
   */
  public dispatchEvent (event) {
    if (event == null || typeof event.type !== 'string') {
      throw new TypeError('"event.type" should be a string.')
    }

    // If listeners aren't registered, terminate.
    const listeners = getListeners(this)
    const eventName = event.type
    let node = listeners.get(eventName)
    if (node == null) {
      return true
    }

    // Since we cannot rewrite several properties, so wrap object.
    const wrappedEvent = wrapEvent(this, event)

    // This doesn't process capturing phase and bubbling phase.
    // This isn't participating in a tree.
    let prev = null
    while (node != null) {
      // Remove this listener if it's once
      if (node.once) {
        if (prev !== null) {
          prev.next = node.next
        } else if (node.next !== null) {
          listeners.set(eventName, node.next)
        } else {
          listeners.delete(eventName)
        }
      } else {
        prev = node
      }

      // Call this listener
      setPassiveListener(
        wrappedEvent,
        node.passive ? node.listener : null
      )
      if (typeof node.listener === 'function') {
        try {
          node.listener.call(this, wrappedEvent)
        } catch (err) {
          if (
            typeof console !== 'undefined' &&
                      typeof console.error === 'function'
          ) {
            console.error(err)
          }
        }
      } else if (
        node.listenerType !== ATTRIBUTE &&
              typeof node.listener.handleEvent === 'function'
      ) {
        node.listener.handleEvent(wrappedEvent)
      }

      // Break if `event.stopImmediatePropagation` was called.
      if (isStopped(wrappedEvent)) {
        break
      }

      node = node.next
    }
    setPassiveListener(wrappedEvent, null)
    setEventPhase(wrappedEvent, 0)
    setCurrentTarget(wrappedEvent, null)

    return !wrappedEvent.defaultPrevented
  }
}
// // Ensure `eventTarget instanceof window.EventTarget` is `true`.
// if (
//   typeof window !== 'undefined' &&
//   typeof window.EventTarget !== 'undefined'
// ) {
//   Object.setPrototypeOf(EventTarget.prototype, window.EventTarget.prototype)
// }

export { defineEventAttribute, EventTarget }
