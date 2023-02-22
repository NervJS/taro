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

import { navigationRef } from './rootNavigation'
import { errorHandler, successHandler } from './utils/index'
import { BaseOption, CallbackResult } from './utils/types'

interface NavigateBarTitleOption extends BaseOption {
  title: string
}
interface NavigateBarColorOption extends BaseOption {
  backgroundColor: string
  frontColor: string
}

function setNavigateConfig (obj) {
  const oldParams: Record<string, any> = navigationRef.current?.getCurrentRoute()?.params || {}
  const params = oldParams?.navigateConfig || {}
  navigationRef.current?.setParams({
    navigateConfig: Object.assign({}, { ...params }, { ...obj })
  } as never)
}

export function setNavigationBarTitle (option: NavigateBarTitleOption): Promise<CallbackResult> {
  const { title, fail, success, complete } = option
  let msg
  try {
    navigationRef.current?.setOptions({
      title: title
    })
  } catch (error) {
    msg = error
    return errorHandler(fail, complete)({ errMsg: msg })
  }
  msg = 'setNavigationBarTitle:ok'
  return successHandler(success, complete)({ errMsg: msg })
}

export function setNavigationBarColor (option: NavigateBarColorOption): Promise<CallbackResult> {
  const { backgroundColor, frontColor, fail, success, complete } = option
  let msg
  const options: any = navigationRef.current?.getCurrentOptions()
  const defaultStyle = options?.headerStyle || {}
  const headerStyle = Object.assign({}, defaultStyle, {
    backgroundColor: backgroundColor
  })
  const params = Object.assign({}, options, {
    headerStyle: headerStyle,
    headerTintColor: frontColor
  })
  try {
    navigationRef.current?.setOptions({ ...params })
  } catch (error) {
    msg = error
    return errorHandler(fail, complete)({ errMsg: msg })
  }
  msg = 'setNavigationBarColor:ok'
  return successHandler(success, complete)({ errMsg: msg })
}

export function showNavigationBarLoading (option: BaseOption = {}): Promise<CallbackResult> {
  const { fail, success, complete } = option
  let msg
  try {
    setNavigateConfig({ showLoading: true })
  } catch (error) {
    msg = error
    return errorHandler(fail, complete)({ errMsg: msg })
  }
  msg = 'showNavigationBarLoading:ok'
  return successHandler(success, complete)({ errMsg: msg })
}

export function hideNavigationBarLoading (option: BaseOption = {}): Promise<CallbackResult> {
  const { fail, success, complete } = option
  let msg
  try {
    setNavigateConfig({ showLoading: false })
  } catch (error) {
    msg = error
    return errorHandler(fail, complete)({ errMsg: msg })
  }
  msg = 'hideNavigationBarLoading:ok'
  return successHandler(success, complete)({ errMsg: msg })
}
