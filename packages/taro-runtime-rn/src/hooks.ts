/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import * as React from 'react'

import { Current } from './current'
import { PageLifeCycle } from './instance'
import { getPageInstance, injectPageInstance, PageContext } from './page'
import { isArray, isFunction } from './utils'

const taroHooks = (lifecycle: keyof PageLifeCycle) => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (fn: Function) => {
    const id = React.useContext(PageContext)

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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useRouter = (dynamic = false) => {
  return dynamic ? Current.router : React.useMemo(() => Current.router, [])
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useScope = () => undefined
