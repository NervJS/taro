/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
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

import Taro from '@tarojs/taro'

// In DEV mode, this Set helps us only log a warning once per component instance.
// This avoids spamming the console every time a render happens.
export const defaultItemKey = (index: number, _itemData?: unknown) => index

interface IHorizontal {
  direction?: string
  layout?: string
}
export function isHorizontalFunc ({ direction, layout }: IHorizontal) {
  return direction === 'horizontal' || layout === 'horizontal'
}
interface IRrl {
  direction?: string
}
export function isRtlFunc ({ direction }: IRrl) {
  return direction === 'rtl'
}

export function getRectSize (id: string, success?: TFunc, fail?: TFunc, retryMs = 500) {
  const query = Taro.createSelectorQuery()
  try {
    query.select(id).boundingClientRect((res) => {
      if (res) {
        success?.(res)
      } else {
        fail?.()
      }
    }).exec()
  } catch (err) {
    setTimeout(() => {
      getRectSize(id, success, fail, retryMs)
    }, retryMs)
  }
}

export async function getScrollViewContextNode (id: string) {
  const query = Taro.createSelectorQuery()
  return new Promise((resolve) => query.select(id).node(({ node }) => resolve(node)).exec())
}
