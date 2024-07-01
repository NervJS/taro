import * as React from 'react'
import Solid from 'solid-js'

import type { TFunc } from '@tarojs/runtime'

export const useState = process.env.FRAMEWORK === 'solid' ? <T = any>(value: T, options?): [() => T, TFunc] => {
  const [state, setState] = Solid.createSignal(value, options)
  return [state, setState]
} : React.useState

export const useCallback = process.env.FRAMEWORK === 'solid' ? ((callback, deps) => {
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
}) as typeof React.useCallback : React.useCallback

export const useEffect = process.env.FRAMEWORK === 'solid' ? (effect, deps) => {
  Solid.createEffect(() => {
    const cleanup = effect()
    deps.forEach(dep => dep)

    return () => {
      if (typeof cleanup === 'function') cleanup()
    }
  })
} : React.useEffect

export const useMemo = process.env.FRAMEWORK === 'solid' ? Solid.createMemo : React.useMemo

export const useRef = process.env.FRAMEWORK === 'solid' ? <T = any>(init?: T) => {
  const [state] = Solid.createSignal(init)
  return {
    current: state()
  }
} : React.useRef

export const createContext = process.env.FRAMEWORK === 'solid' ? Solid.createContext : React.createContext
export const useContext = process.env.FRAMEWORK === 'solid' ? Solid.useContext : React.useContext
export const memo = process.env.FRAMEWORK === 'solid' ? (component, _propsAreEqual) => component : React.memo // eslint-disable-line @typescript-eslint/no-unused-vars
export const forwardRef = process.env.FRAMEWORK === 'solid' ? (component) => component : React.forwardRef
export const useImperativeHandle = process.env.FRAMEWORK === 'solid' ? (ref, createHandle, deps) => {
  Solid.createEffect(() => {
    deps.forEach(dep => dep)
    ref.current = createHandle()
  })
} : React.useImperativeHandle