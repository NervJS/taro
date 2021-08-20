/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import * as React from 'react'
import { Current } from './current'
import { PageLifeCycle } from './instance'
import { PageContext, getPageInstance, injectPageInstance } from './page'
import { isFunction, isArray } from './utils'

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
