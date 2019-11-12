import { isFunction, isUndefined, isArray, isNullOrUndef, defer, objectIs } from './util'
import { Current } from './current'

export function forceUpdateCallback () {
  //
}

function getHooks (index) {
  if (Current.current === null) {
    throw new Error(`invalid hooks call: hooks can only be called in a stateless component.`)
  }
  const hooks = Current.current.hooks
  if (index >= hooks.length) {
    hooks.push({})
  }
  return hooks[index]
}

export function useState (initialState) {
  if (isFunction(initialState)) {
    initialState = initialState()
  }
  const hook = getHooks(Current.index++)
  if (!hook.state) {
    hook.component = Current.current
    hook.state = [
      initialState,
      (action) => {
        const nextState = isFunction(action) ? action(hook.state[0]) : action
        if (hook.state[0] === nextState) return
        hook.state[0] = nextState
        hook.component._disable = false
        hook.component.setState({}, forceUpdateCallback)
      }
    ]
  }
  return hook.state
}

function usePageLifecycle (callback, lifecycle) {
  const hook = getHooks(Current.index++)

  if (!hook.marked) {
    hook.marked = true
    hook.component = Current.current
    hook.callback = callback

    const component = hook.component
    const originalLifecycle = component[lifecycle]

    hook.component[lifecycle] = function () {
      const callback = hook.callback
      originalLifecycle && originalLifecycle.call(component, ...arguments)
      return callback && callback.call(component, ...arguments)
    }
  } else {
    hook.callback = callback
  }
}

export function useDidShow (callback) {
  usePageLifecycle(callback, 'componentDidShow')
}

export function useDidHide (callback) {
  usePageLifecycle(callback, 'componentDidHide')
}

export function usePullDownRefresh (callback) {
  usePageLifecycle(callback, 'onPullDownRefresh')
}

export function useReachBottom (callback) {
  usePageLifecycle(callback, 'onReachBottom')
}

export function usePageScroll (callback) {
  usePageLifecycle(callback, 'onPageScroll')
}

export function useResize (callback) {
  usePageLifecycle(callback, 'onResize')
}

export function useShareAppMessage (callback) {
  usePageLifecycle(callback, 'onShareAppMessage')
}

export function useTabItemTap (callback) {
  usePageLifecycle(callback, 'onTabItemTap')
}

export function useRouter () {
  const hook = getHooks(Current.index++)
  if (!hook.router) {
    hook.component = Current.current
    hook.router = hook.component.$router
  }
  return hook.router
}

export function useScope () {
  const hook = getHooks(Current.index++)
  if (!hook.scope) {
    hook.component = Current.current
    hook.scope = hook.component.$scope
  }
  return hook.scope
}

export function useReducer (
  reducer,
  initialState,
  initializer
) {
  if (isFunction(initialState)) {
    initialState = initialState()
  }
  const hook = getHooks(Current.index++)
  if (!hook.state) {
    hook.component = Current.current
    hook.state = [
      isUndefined(initializer) ? initialState : initializer(initialState),
      (action) => {
        hook.state[0] = reducer(hook.state[0], action)
        hook.component._disable = false
        hook.component.setState({}, forceUpdateCallback)
      }
    ]
  }
  return hook.state
}

function areDepsChanged (prevDeps, deps) {
  if (isNullOrUndef(prevDeps) || isNullOrUndef(deps)) {
    return true
  }
  return deps.some((d, i) => !objectIs(d, prevDeps[i]))
}

export function invokeEffects (component, delay) {
  const effects = delay ? component.effects : component.layoutEffects
  effects.forEach((hook) => {
    if (isFunction(hook.cleanup)) {
      hook.cleanup()
    }
    const result = hook.effect()
    if (isFunction(result)) {
      hook.cleanup = result
    }
  })

  if (delay) {
    component.effects = []
  } else {
    component.layoutEffects = []
  }
}

let scheduleEffectComponents = []

function invokeScheduleEffects (component) {
  if (!component._afterScheduleEffect) {
    component._afterScheduleEffect = true
    scheduleEffectComponents.push(component)
    if (scheduleEffectComponents.length === 1) {
      defer(() => {
        setTimeout(() => {
          scheduleEffectComponents.forEach((c) => {
            c._afterScheduleEffect = false
            invokeEffects(c, true)
          })
          scheduleEffectComponents = []
        }, 0)
      })
    }
  }
}

function useEffectImpl (effect, deps, delay) {
  const hook = getHooks(Current.index++)
  if (Current.current._disableEffect || !Current.current.__isReady) {
    return
  }
  if (areDepsChanged(hook.deps, deps)) {
    hook.effect = effect
    hook.deps = deps

    if (delay) {
      Current.current.effects = Current.current.effects.concat(hook)
      invokeScheduleEffects(Current.current)
    } else {
      Current.current.layoutEffects = Current.current.layoutEffects.concat(hook)
    }
  }
}

export function useEffect (effect, deps) {
  useEffectImpl(effect, deps, true)
}

export function useLayoutEffect (effect, deps) {
  useEffectImpl(effect, deps)
}

export function useRef (initialValue) {
  const hook = getHooks(Current.index++)
  if (!hook.ref) {
    hook.ref = {
      current: initialValue
    }
  }
  return hook.ref
}

export function useMemo (factory, deps) {
  const hook = getHooks(Current.index++)
  if (areDepsChanged(hook.deps, deps)) {
    hook.deps = deps
    hook.callback = factory
    hook.value = factory()
  }
  return hook.value
}

export function useCallback (callback, deps) {
  return useMemo(() => callback, deps)
}

export function useImperativeHandle (ref, init, deps) {
  useLayoutEffect(() => {
    if (isFunction(ref)) {
      ref(init())
      return () => ref(null)
    } else if (!isUndefined(ref)) {
      ref.current = init()
      return () => {
        delete ref.current
      }
    }
  }, isArray(deps) ? deps.concat([ref]) : undefined)
}

export function useContext ({ context }) {
  const emitter = context.emitter
  if (emitter === null) {
    return context._defaultValue
  }
  const hook = getHooks(Current.index++)
  if (isUndefined(hook.context)) {
    hook.context = true
    hook.component = Current.current
    emitter.on(_ => {
      if (hook.component) {
        hook.component._disable = false
        hook.component.setState({})
      }
    })
  }
  return emitter.value
}
