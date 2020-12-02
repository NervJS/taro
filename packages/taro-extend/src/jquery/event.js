/* eslint-disable no-mixed-operators */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
//     Zepto.js
//     (c) 2010-2016 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

export function initEvent ($) {
  let _zid = 1; let undefined
  const slice = Array.prototype.slice
  const isFunction = $.isFunction
  const isString = function (obj) { return typeof obj === 'string' }
  const handlers = {}
  const specialEvents = {}
  const focusinSupported = 'onfocusin' in window
  const focus = { focus: 'focusin', blur: 'focusout' }
  const hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

  function zid (element) {
    return element._zid || (element._zid = _zid++)
  }
  function findHandlers (element, event, fn, selector) {
    event = parse(event)
    let matcher
    if (event.ns) matcher = matcherFor(event.ns)
    return (handlers[zid(element)] || []).filter(function (handler) {
      return handler &&
        (!event.e || handler.e == event.e) &&
        (!event.ns || matcher.test(handler.ns)) &&
        (!fn || zid(handler.fn) === zid(fn)) &&
        (!selector || handler.sel == selector)
    })
  }
  function parse (event) {
    const parts = ('' + event).split('.')
    return { e: parts[0], ns: parts.slice(1).sort().join(' ') }
  }
  function matcherFor (ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
  }

  function eventCapture (handler, captureSetting) {
    return handler.del &&
      (!focusinSupported && (handler.e in focus)) ||
      !!captureSetting
  }

  function realEvent (type) {
    return hover[type] || (focusinSupported && focus[type]) || type
  }

  function add (element, events, fn, data, selector, delegator, capture) {
    const id = zid(element); const set = (handlers[id] || (handlers[id] = []))
    events.split(/\s/).forEach(function (event) {
      if (event == 'ready') return $(document).ready(fn)
      const handler = parse(event)
      handler.fn = fn
      handler.sel = selector
      // emulate mouseenter, mouseleave
      if (handler.e in hover) {
        fn = function (e) {
          const related = e.relatedTarget
          if (!related || (related !== this && !$.contains(this, related))) { return handler.fn.apply(this, arguments) }
        }
      }
      handler.del = delegator
      const callback = delegator || fn
      handler.proxy = function (e) {
        e = compatible(e)
        if (e.isImmediatePropagationStopped()) return
        e.data = data
        const result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
        if (result === false) e.preventDefault(), e.stopPropagation()
        return result
      }
      handler.i = set.length
      set.push(handler)
      if ('addEventListener' in element) { element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture)) }
    })
  }
  function remove (element, events, fn, selector, capture) {
    const id = zid(element)
    ;(events || '').split(/\s/).forEach(function (event) {
      findHandlers(element, event, fn, selector).forEach(function (handler) {
        delete handlers[id][handler.i]
        if ('removeEventListener' in element) { element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture)) }
      })
    })
  }

  $.event = { add: add, remove: remove }

  $.proxy = function (fn, context) {
    const args = (2 in arguments) && slice.call(arguments, 2)
    if (isFunction(fn)) {
      const proxyFn = function () { return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) }
      proxyFn._zid = zid(fn)
      return proxyFn
    } else if (isString(context)) {
      if (args) {
        args.unshift(fn[context], fn)
        return $.proxy.apply(null, args)
      } else {
        return $.proxy(fn[context], fn)
      }
    } else {
      throw new TypeError('expected function')
    }
  }

  $.fn.bind = function (event, data, callback) {
    return this.on(event, data, callback)
  }
  $.fn.unbind = function (event, callback) {
    return this.off(event, callback)
  }
  $.fn.one = function (event, selector, data, callback) {
    return this.on(event, selector, data, callback, 1)
  }

  const returnTrue = function () { return true }
  const returnFalse = function () { return false }
  const ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/
  const eventMethods = {
    preventDefault: 'isDefaultPrevented',
    stopImmediatePropagation: 'isImmediatePropagationStopped',
    stopPropagation: 'isPropagationStopped'
  }

  function compatible (event, source) {
    if (source || !event.isDefaultPrevented) {
      source || (source = event)

      $.each(eventMethods, function (name, predicate) {
        const sourceMethod = source[name]
        event[name] = function () {
          this[predicate] = returnTrue
          return sourceMethod && sourceMethod.apply(source, arguments)
        }
        event[predicate] = returnFalse
      })

      try {
        event.timeStamp || (event.timeStamp = Date.now())
      } catch (ignored) { }

      if (source.defaultPrevented !== undefined ? source.defaultPrevented
        : 'returnValue' in source ? source.returnValue === false
          : source.getPreventDefault && source.getPreventDefault()) { event.isDefaultPrevented = returnTrue }
    }
    return event
  }

  function createProxy (event) {
    let key; const proxy = { originalEvent: event }
    for (key in event) { if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key] }

    return compatible(proxy, event)
  }

  $.fn.delegate = function (selector, event, callback) {
    return this.on(event, selector, callback)
  }
  $.fn.undelegate = function (selector, event, callback) {
    return this.off(event, selector, callback)
  }

  $.fn.live = function (event, callback) {
    $(document.body).delegate(this.selector, event, callback)
    return this
  }
  $.fn.die = function (event, callback) {
    $(document.body).undelegate(this.selector, event, callback)
    return this
  }

  $.fn.on = function (event, selector, data, callback, one) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let autoRemove; let delegator; const $this = this
    if (event && !isString(event)) {
      $.each(event, function (type, fn) {
        $this.on(type, selector, data, fn, one)
      })
      return $this
    }

    if (!isString(selector) && !isFunction(callback) && callback !== false) { callback = data, data = selector, selector = undefined }
    if (callback === undefined || data === false) { callback = data, data = undefined }

    if (callback === false) callback = returnFalse

    return $this.each(function (_, element) {
      if (one) {
        autoRemove = function (e) {
          remove(element, e.type, callback)
          return callback.apply(this, arguments)
        }
      }

      if (selector) {
        delegator = function (e) {
          let evt; const match = $(e.target).closest(selector, element).get(0)
          if (match && match !== element) {
            evt = $.extend(createProxy(e), { currentTarget: match, liveFired: element })
            return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
          }
        }
      }

      add(element, event, callback, data, selector, delegator || autoRemove)
    })
  }
  $.fn.off = function (event, selector, callback) {
    const $this = this
    if (event && !isString(event)) {
      $.each(event, function (type, fn) {
        $this.off(type, selector, fn)
      })
      return $this
    }

    if (!isString(selector) && !isFunction(callback) && callback !== false) { callback = selector, selector = undefined }

    if (callback === false) callback = returnFalse

    return $this.each(function () {
      remove(this, event, callback, selector)
    })
  }

  $.fn.trigger = function (event, args) {
    event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
    event._args = args
    return this.each(function () {
      // handle focus(), blur() by calling them directly
      if (event.type in focus && typeof this[event.type] === 'function') this[event.type]()
      // items in the collection might not be DOM elements
      else if ('dispatchEvent' in this) this.dispatchEvent(event)
      else $(this).triggerHandler(event, args)
    })
  }

  // triggers event handlers on current element just as if an event occurred,
  // doesn't trigger an actual event, doesn't bubble
  $.fn.triggerHandler = function (event, args) {
    let e, result
    this.each(function (i, element) {
      e = createProxy(isString(event) ? $.Event(event) : event)
      e._args = args
      e.target = element
      $.each(findHandlers(element, event.type || event), function (i, handler) {
        result = handler.proxy(e)
        if (e.isImmediatePropagationStopped()) return false
      })
    })
    return result
  }

  // shortcut methods for `.bind(event, fn)` for each event type
  ;('focusin focusout focus blur load resize scroll unload click dblclick ' +
  'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' +
  'change select keydown keypress keyup error').split(' ').forEach(function (event) {
    $.fn[event] = function (callback) {
      return (0 in arguments)
        ? this.bind(event, callback)
        : this.trigger(event)
    }
  })

  $.Event = function (type, props) {
    if (!isString(type)) props = type, type = props.type
    const event = document.createEvent(specialEvents[type] || 'Events'); let bubbles = true
    if (props) for (const name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
    event.initEvent(type, bubbles, true)
    return compatible(event)
  }
}
