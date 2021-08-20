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

import { AppConfig } from '@tarojs/taro'
import { history } from './history'

export function initTabbar (config: AppConfig) {
  if (config.tabBar == null) {
    return
  }

  // TODO: 找到 tabbar 的类型
  const tabbar = document.createElement('taro-tabbar') as any
  const homePage = config.pages ? config.pages[0] : ''
  tabbar.conf = config.tabBar
  tabbar.conf.homePage = history.location.pathname === '/' ? homePage : history.location.pathname
  const routerConfig = (config as any).router
  tabbar.conf.mode = routerConfig && routerConfig.mode ? routerConfig.mode : 'hash'
  tabbar.conf.custom = !!routerConfig.customRoutes
  if (routerConfig.customRoutes) {
    tabbar.conf.custom = true
    tabbar.conf.customRoutes = routerConfig.customRoutes
  } else {
    tabbar.conf.custom = false
    tabbar.conf.customRoutes = {}
  }
  const container = document.getElementById('container')
  // eslint-disable-next-line no-unused-expressions
  container?.appendChild(tabbar)
}
