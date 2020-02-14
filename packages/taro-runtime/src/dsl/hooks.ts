import { PageContext, R as React } from './react'
import { getPageInstance, injectPageInstance } from './common'
import { PageLifeCycle } from './instance'
import { Current } from '../current'

const taroHooks = (lifecycle: keyof PageLifeCycle) => {
  return (fn: Function) => {
    const id = React.useContext(PageContext)
    let inst = getPageInstance(id)
    React.useLayoutEffect(() => {
      let first = false
      if (inst == null) {
        first = true
        inst = Object.create(null)
      }
      inst![lifecycle] = fn.bind(null)
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

export const useRouter = () => Current.router

export const useScope = () => undefined
