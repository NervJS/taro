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

import { CallbackResult, OptionsFunc } from './types/index'

export const incrementId = () => {
  const chatCodes: number[] = []
  // A-Z
  for (let i = 65; i <= 90; i++) {
    chatCodes.push(i)
  }
  // a-z
  for (let i = 97; i <= 122; i++) {
    chatCodes.push(i)
  }
  const chatCodesLen = chatCodes.length - 1
  const list = [0, 0]
  return () => {
    const target = list.map(item => chatCodes[item])
    const res = String.fromCharCode(...target)

    let tailIdx = list.length - 1

    list[tailIdx]++

    while (list[tailIdx] > chatCodesLen) {
      list[tailIdx] = 0
      tailIdx = tailIdx - 1
      if (tailIdx < 0) {
        list.push(0)
        break
      }
      list[tailIdx]++
    }

    return res
  }
}


export function isFunction (o: unknown): o is (...args: any[]) => any {
  return typeof o === 'function'
}

export const EMPTY_OBJ: any = {}

export const isArray = Array.isArray

export function successHandler (success: OptionsFunc | undefined, complete: OptionsFunc | undefined): any {
  return function (res: CallbackResult) {
    success && isFunction(success) && success(res)
    complete && isFunction(complete) && complete(res)
    return Promise.resolve(res)
  }
}

export function errorHandler (fail: OptionsFunc | undefined, complete: OptionsFunc | undefined): any {
  return function (res: CallbackResult) {
    fail && isFunction(fail) && fail(res)
    complete && isFunction(complete) && complete(res)
    return Promise.reject(res)
  }
}
