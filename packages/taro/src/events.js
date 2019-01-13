class Events {
  constructor (opts) {
    if (typeof opts !== 'undefined' && opts.callbacks) {
      this.callbacks = opts.callbacks
    } else {
      this.callbacks = {}
    }
  }

  on (events, callback, context) {
    let calls, event, node, tail, list
    if (!callback) {
      return this
    }
    events = events.split(Events.eventSplitter)
    calls = this.callbacks
    while ((event = events.shift())) {
      list = calls[event]
      node = list ? list.tail : {}
      node.next = tail = {}
      node.context = context
      node.callback = callback
      calls[event] = {
        tail,
        next: list ? list.next : node
      }
    }
    return this
  }

  once (events, callback, context) {
    const wrapper = (...args) => {
      callback.apply(this, args)
      this.off(events, wrapper, context)
    }

    this.on(events, wrapper, context)

    return this
  }

  off (events, callback, context) {
    let event, calls, node, tail, cb, ctx
    if (!(calls = this.callbacks)) {
      return this
    }
    if (!(events || callback || context)) {
      delete this.callbacks
      return this
    }
    events = events ? events.split(Events.eventSplitter) : Object.keys(calls)
    while ((event = events.shift())) {
      node = calls[event]
      delete calls[event]
      if (!node || !(callback || context)) {
        continue
      }
      tail = node.tail
      while ((node = node.next) !== tail) {
        cb = node.callback
        ctx = node.context
        if ((callback && cb !== callback) || (context && ctx !== context)) {
          this.on(event, cb, ctx)
        }
      }
    }
    return this
  }

  trigger (events) {
    let event, node, calls, tail, rest
    if (!(calls = this.callbacks)) {
      return this
    }
    events = events.split(Events.eventSplitter)
    rest = [].slice.call(arguments, 1)
    while ((event = events.shift())) {
      if ((node = calls[event])) {
        tail = node.tail
        while ((node = node.next) !== tail) {
          node.callback.apply(node.context || this, rest)
        }
      }
    }
    return this
  }
}

Events.eventSplitter = /\s+/

export default Events
