import { isFunction, isUndefined, isArray, isNullOrUndef, defer, objectIs } from './util'
import { Current } from './current'

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
        hook.state[0] = isFunction(action) ? action(hook.state[0]) : action
        hook.component._disable = false
        hook.component.setState({})
      }
    ]
  }
  return hook.state
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
        hook.component.setState({})
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
  const emiter = context.emiter
  if (emiter === null) {
    return context._defaultValue
  }
  const hook = getHooks(Current.index++)
  if (isUndefined(hook.context)) {
    hook.context = true
    hook.component = Current.current
    emiter.on(_ => {
      if (hook.component) {
        hook.component._disable = false
        hook.component.setState({})
      }
    })
  }
  return emiter.value
}
