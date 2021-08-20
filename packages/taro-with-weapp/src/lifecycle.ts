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

interface LifecycleMap {
  [key: string]: string[]
}

export enum TaroLifeCycles {
  WillMount = 'componentWillMount',
  DidMount = 'componentDidMount',
  DidShow = 'componentDidShow',
  DidHide = 'componentDidHide',
  WillUnmount = 'componentWillUnmount'
}

export const lifecycleMap: LifecycleMap = {
  [TaroLifeCycles.WillMount]: ['created'],
  [TaroLifeCycles.DidMount]: ['attached'],
  [TaroLifeCycles.DidShow]: ['onShow'],
  [TaroLifeCycles.DidHide]: ['onHide'],
  [TaroLifeCycles.WillUnmount]: ['detached', 'onUnload']
}

export const lifecycles = new Set<string>(['ready'])

for (const key in lifecycleMap) {
  const lifecycle = lifecycleMap[key]
  lifecycle.forEach(l => lifecycles.add(l))
}

export const uniquePageLifecycle = [
  'onPullDownRefresh',
  'onReachBottom',
  'onShareAppMessage',
  'onShareTimeline',
  'onAddToFavorites',
  'onPageScroll',
  'onResize',
  'onTabItemTap'
]

export const appOptions = [
  'onLaunch',
  'onShow',
  'onHide',
  'onError',
  'onPageNotFound',
  'onUnhandledRejection',
  'onThemeChange'
]
