/*
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

import { shouleBeObject, getParameterError } from '../utils'

export function setNavigationBarTitle (options) {
  // options must be an Object
  const isObject = shouleBeObject(options)
  if (!isObject.res) {
    const res = { errMsg: `setNavigationBarTitle${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { title, success, fail, complete } = options
  const res = { errMsg: 'setNavigationBarTitle:ok' }

  if (!title || typeof title !== 'string') {
    res.errMsg = getParameterError({
      name: 'setNavigationBarTitle',
      para: 'title',
      correct: 'String',
      wrong: title
    })
    console.error(res.errMsg)
    typeof fail === 'function' && fail(res)
    typeof complete === 'function' && complete(res)
    return Promise.reject(res)
  }

  if (document.title !== title) {
    document.title = title
  }

  typeof success === 'function' && success(res)
  typeof complete === 'function' && complete(res)

  return Promise.resolve(res)
}

/**
 * @typedef {Object} NavigationBarColorParam
 * @property {string} frontColor 前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
 * @property {string} backgroundColor 背景颜色值，有效值为十六进制颜色
 * @property {{duration: number, timingFunc: string}} animation 动画效果
 * @property {function} [success] 接口调用成功的回调函数
 * @property {function} [fail] 接口调用失败的回调函数
 * @property {function} [complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 */

/**
 * 设置页面导航条颜色
 * @param {NavigationBarColorParam} options
 */
export function setNavigationBarColor (options) {
  const meta = document.createElement('meta')
  meta.setAttribute('name', 'theme-color')
  meta.setAttribute('content', options.backgroundColor)
  document.head.appendChild(meta)
}
