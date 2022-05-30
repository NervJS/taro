type Callback1<T1> = (arg1: T1) => any;
type Callback2<T1, T2> = (arg1: T1, arg2: T2) => any;
type Callback3<T1, T2, T3> = (arg1: T1, arg2: T2, arg3: T3) => any;
type Callback4<T1, T2, T3, T4> = (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => any;
type Callback5<T1, T2, T3, T4, T5> = (arg1: T1, arg2: T2, arg3: T3,
  arg4: T4, arg5: T5) => any;
type Callback6Rest<T1, T2, T3, T4, T5, T6> = (arg1: T1, arg2: T2, arg3: T3,
  arg4: T4, arg5: T5, arg6: T6,
  ...rest: any[]) => any;

export class Events {
  protected callbacks?: Record<string, unknown>
  static eventSplitter = /\s+/

  constructor (opts?) {
    this.callbacks = opts?.callbacks ?? {}
  }

  on<T>(event: string, callback: Callback1<T>, context?): this
  on<T1, T2>(event: string, callback: Callback2<T1, T2>, context?): this
  on<T1, T2, T3>(event: string, callback: Callback3<T1, T2, T3>, context?): this
  on<T1, T2, T3, T4>(event: string, callback: Callback4<T1, T2, T3, T4>, comtext): this
  on<T1, T2, T3, T4, T5>(event: string, callback: Callback5<T1, T2, T3, T4, T5>, context?): this
  on<T1, T2, T3, T4, T5, T6>(event: string, callback: Callback6Rest<T1, T2, T3, T4, T5, T6>, context?): this
  on (eventName, callback, context): this {
    let event, node, tail, list
    if (!callback) {
      return this
    }
    eventName = eventName.split(Events.eventSplitter)
    this.callbacks ||= {}
    const calls = this.callbacks
    while ((event = eventName.shift())) {
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

  off (events, callback?, context?) {
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

  trigger(event: string)
  trigger<T1>(event: string, arg: T1)
  trigger<T1, T2>(event: string, arg1: T1, arg2: T2)
  trigger<T1, T2, T3>(event: string, arg1: T1, arg2: T2, arg3: T3)
  trigger<T1, T2, T3, T4>(event: string, arg1: T1, arg2: T2, arg3: T3, arg4: T4)
  trigger<T1, T2, T3, T4, T5>(event: string, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5)
  trigger<T1, T2, T3, T4, T5, T6>(event: string, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5,
    arg6: T6, ...rest: any[])

  trigger (events) {
    let event, node, calls, tail
    if (!(calls = this.callbacks)) {
      return this
    }
    events = events.split(Events.eventSplitter)
    const rest = [].slice.call(arguments, 1)
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
