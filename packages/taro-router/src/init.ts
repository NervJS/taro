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

import { initTabbar } from './tabbar'
import { setHistoryMode } from './history'
import { RouterConfig } from './router'

export const routerConfig: RouterConfig = Object.create(null)

export function init (config: RouterConfig) {
  config.router.mode = config.router.mode || 'hash'
  setHistoryMode(config.router.mode, config.router.basename)
  Object.assign(routerConfig, config)
  document.getElementById('app')?.remove()

  const container = document.createElement('div')
  container.classList.add('taro-tabbar__container')
  container.id = 'container'

  const panel = document.createElement('div')
  panel.classList.add('taro-tabbar__panel')

  const app = document.createElement('div')
  app.id = 'app'
  app.classList.add('taro_router')

  panel.appendChild(app)
  container.appendChild(panel)

  document.body.appendChild(container)

  initTabbar(config)
}
