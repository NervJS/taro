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

import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake'
import { successHandler, errorHandler } from '../../utils'

/**
 * keepScreenOn
 * @param {{}} opts
 * @param {boolean} opts.keepScreenOn - 是否保持屏幕常亮
 */
export async function setKeepScreenOn(opts: Taro.setKeepScreenOn.Option): Promise<Taro.setKeepScreenOn.Promised> {
  const res = { errMsg: 'setKeepScreenOn:ok' } as any
  const { keepScreenOn, success, fail, complete } = opts
  try {
    if (keepScreenOn) {
      activateKeepAwake()
    } else {
      deactivateKeepAwake()
    }
    return successHandler(success, complete)(res)
  } catch (e) {
    res.errMsg = `setKeepScreenOn:fail invalid ${e}`
    return errorHandler(fail, complete)(res)
  }
}
