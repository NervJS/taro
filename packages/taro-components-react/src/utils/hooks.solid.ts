import Solid from 'solid-js'

import type { TFunc } from '@tarojs/runtime/dist/runtime.esm'

export const useState = <T = any>(value: T, options?): [() => T, TFunc] => {
  const [state, setState] = Solid.createSignal(value, options)
  return [state, setState]
}

export const useCallback = (callback, deps) => {
  const [_, setSignal] = Solid.createSignal(0) // eslint-disable-line @typescript-eslint/no-unused-vars

  Solid.createEffect(() => {
    deps.forEach(dep => typeof dep === 'function' ? dep() : dep)
    setSignal(s => s + 1)
  })

  return async (...args) => {
    Solid.createEffect(() => {
      const clean = callback(...args)
      return typeof clean === 'function' && Solid.onCleanup(clean)
    })
  }
}

export const useEffect = (effect, deps) => {
  Solid.createEffect(() => {
    const cleanup = effect()
    deps.forEach(dep => dep)

    return () => {
      if (typeof cleanup === 'function') cleanup()
    }
  })
}

export const useMemo = Solid.createMemo

export const useRef = <T = any>(init?: T) => {
  const [state] = Solid.createSignal(init)
  return {
    current: state()
  }
}

export const createContext = Solid.createContext
export const useContext = Solid.useContext
export const memo = (component, _propsAreEqual) => component // eslint-disable-line @typescript-eslint/no-unused-vars
export const forwardRef = (component) => component
export const useImperativeHandle = (ref, createHandle, deps) => {
  Solid.createEffect(() => {
    deps.forEach(dep => dep)
    ref.current = createHandle()
  })
}
