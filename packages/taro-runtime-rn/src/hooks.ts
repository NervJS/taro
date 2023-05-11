import * as React from 'react'

import { Current } from './current'
import { AppInstance, PageLifeCycle } from './instance'
import { getPageInstance, injectPageInstance, PageContext } from './page'
import { HOOKS_APP_ID, isArray, isFunction } from './utils'

const taroHooks = (lifecycle: keyof PageLifeCycle | keyof AppInstance) => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (fn: Function) => {
    const id = React.useContext(PageContext) || HOOKS_APP_ID

    const fnRef = React.useRef(fn)
    if (fnRef.current !== fn) fnRef.current = fn

    React.useLayoutEffect(() => {
      let inst = getPageInstance(id)
      let first = false
      if (inst == null) {
        first = true
        inst = Object.create(null)
      }

      inst = inst!

      const callback = (...args: any) => fnRef.current(...args)

      if (isFunction(inst[lifecycle])) {
        (inst[lifecycle] as any) = [inst[lifecycle], callback]
      } else {
        (inst[lifecycle] as any) = [
          ...((inst[lifecycle] as any) || []),
          callback
        ]
      }

      if (first) {
        injectPageInstance(inst!, id)
      }
      return () => {
        const inst = getPageInstance(id)
        const list = inst![lifecycle]
        if (list === callback) {
          (inst![lifecycle] as any) = undefined
        } else if (isArray(list)) {
          (inst![lifecycle] as any) = list.filter(item => item !== callback)
        }
      }
    }, [id])
  }
}

export const useDidShow = taroHooks('componentDidShow')

export const useDidHide = taroHooks('componentDidHide')

export const useLoad = taroHooks('onLoad')

export const useReady = taroHooks('onReady')

export const useUnload = taroHooks('onUnload')

export const usePullDownRefresh = taroHooks('onPullDownRefresh')

export const useReachBottom = taroHooks('onReachBottom')

export const usePageScroll = taroHooks('onPageScroll')

export const useResize = taroHooks('onResize')

export const useTabItemTap = taroHooks('onTabItemTap')

export const useLaunch = taroHooks('onLaunch')

export const usePageNotFound= taroHooks('onPageNotFound')

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useRouter = (dynamic = false) => {
  return dynamic ? Current.router : React.useMemo(() => Current.router, [])
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useScope = () => undefined
