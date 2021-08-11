interface CallbackManager {
  add: (opt: any) => void;
  remove: (opt: any) => void;
  clear: () => void;
  count: () => number;
  trigger: (...args: any[]) => void;
}

export function createCallbackManager(): CallbackManager {
  const _callbacks: Set<any> = new Set()

  const add = (opt) => {
    _callbacks.add(opt)
  }

  const remove = (opt) => {
    _callbacks.delete(opt)
  }

  const clear = () => {
    _callbacks.clear()
  }

  const count = (): number => {
    return _callbacks.size
  }

  const trigger = (...args) => {
    _callbacks.forEach(opt => {
      if (typeof opt === 'function') {
        opt(...args)
      } else {
        const { callback, ctx } = opt
        callback.call(ctx, ...args)
      }
    })
  }

  return {
    add,
    remove,
    clear,
    count,
    trigger,
  }
}
