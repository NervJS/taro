import { PageContext, R as React } from './react'
import { getPageInstance, injectPageInstance } from './common'
import { PageLifeCycle } from './instance'
import { Current } from '../current'

const taroHooks = (lifecycle: keyof PageLifeCycle) => {
  return (fn: Function) => {
    const id = React.useContext(PageContext)

    // hold fn ref and keep up to date
    const fnRef = React.useRef(fn)
    if (fnRef.current !== fn) fnRef.current = fn

    React.useLayoutEffect(() => {
      let inst = getPageInstance(id)
      let first = false
      if (inst == null) {
        first = true
        inst = Object.create(null)
      }

      // callback is immutable but inner function is up to date
      const callback = (...args: any) => fnRef.current(...args)
      if (lifecycle !== 'onShareAppMessage') {
        (inst![lifecycle] as any) = [
          ...((inst![lifecycle] as any) || []),
          callback
        ]
      } else {
        inst![lifecycle] = callback
      }
      if (first) {
        injectPageInstance(inst!, id)
      }
    }, [])
  }
}

export const useDidShow = taroHooks('componentDidShow')

export const useDidHide = taroHooks('componentDidHide')

export const usePullDownRefresh = taroHooks('onPullDownRefresh')

export const useReachBottom = taroHooks('onReachBottom')

export const usePageScroll = taroHooks('onPageScroll')

export const useResize = taroHooks('onResize')

export const useShareAppMessage = taroHooks('onShareAppMessage')

export const useTabItemTap = taroHooks('onTabItemTap')

export const useTitleClick = taroHooks('onTitleClick')

export const useOptionMenuClick = taroHooks('onOptionMenuClick')

export const usePullIntercept = taroHooks('onPullIntercept')

export const useReady = taroHooks('onReady')

export const useRouter = (dynamic = false) => {
  return dynamic ? Current.router : React.useMemo(() => Current.router, [])
}

export const useScope = () => undefined
