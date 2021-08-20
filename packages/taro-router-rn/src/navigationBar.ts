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

import { successHandler, errorHandler } from './utils/index'
import { CallbackResult, BaseOption } from './utils/types'
import { navigationRef, isTabPage } from './rootNavigation'

interface NavigateBarTitleOption extends BaseOption {
  title: string
}
interface NavigateBarColorOption extends BaseOption {
  backgroundColor: string,
  frontColor: string
}

function setNavigateConfig (obj) {
  const oldParams: Record<string, any> = navigationRef.current?.getCurrentRoute()?.params || {}
  const params = oldParams?.navigateConfig || {}
  navigationRef.current?.setParams({
    navigateConfig: Object.assign({}, { ...params }, { ...obj })
  })
}

export function setNavigationBarTitle (option: NavigateBarTitleOption): Promise<CallbackResult> {
  const { title, fail, success, complete } = option
  let msg
  try {
    // 如果是tabbar，设置会不生效，设置setParams ,触发tab header重新渲染
    if (isTabPage()) {
      setNavigateConfig({ title })
    } else {
      navigationRef.current?.setOptions({
        title: title
      })
    }
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
    // 如果是tabbar，设置会不生效，设置setParams ,触发tab header更新
    if (isTabPage()) {
      setNavigateConfig({ ...params })
    } else {
      navigationRef.current?.setOptions({ ...params })
    }
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
