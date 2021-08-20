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

export let routesAlias = {}

export function setRoutesAlias (alias) {
  routesAlias = alias
}

export function addLeadingSlash (path?: string) {
  if (path == null) {
    return ''
  }
  return path.charAt(0) === '/' ? path : '/' + path
}

// 解决navigateBack调用delta>1时,路由栈异常问题
// 比如:A->B->C,navigateBack({delta: 2}),此时路由栈中还存在B页面
// 原因:主要是由于一次性退出多层级页面时,此action只会执行一次,此处进行手动处理
export let historyBackDelta = 1
export function setHistoryBackDelta (delta: number) {
  historyBackDelta = delta
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const throttle = (fn: Function, threshold: number) => {
  let lastTime = 0
  return function () {
    const now = Date.now()
    if (now - lastTime > threshold) {
      fn.apply(this, arguments)
      lastTime = now
    }
  }
}
