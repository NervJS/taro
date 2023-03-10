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

import { processApis } from '@tarojs/shared'

import { needPromiseApis } from './apis-list'

import type { IApiDiff } from '@tarojs/shared'

declare const tt: any

const apiDiff: IApiDiff = {
  showToast: {
    options: {
      set: [
        {
          key: 'icon',
          value (options) {
            return options.icon === 'error' ? 'fail' : options.icon
          }
        }
      ]
    }
  }
}

export function transformMeta (api: string, options: Record<string, any>) {
  let apiAlias = api
  Object.keys(apiDiff).forEach(item => {
    const apiItem = apiDiff[item]
    if (api === item) {
      if (apiItem.alias) {
        apiAlias = apiItem.alias
      }
      if (apiItem.options) {
        const change = apiItem.options.change
        const set = apiItem.options.set
        if (change) {
          change.forEach(changeItem => {
            options[changeItem.new] = options[changeItem.old]
          })
        }
        if (set) {
          set.forEach(setItem => {
            options[setItem.key] = typeof setItem.value === 'function' ? setItem.value(options) : setItem.value
          })
        }
      }
    }
  })
  return {
    key: apiAlias,
    options
  }
}



export function initNativeApi (taro) {
  processApis(taro, tt, {
    needPromiseApis,
    transformMeta
  })
}
