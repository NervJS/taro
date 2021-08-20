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

import { defaultReconciler, isArray } from '@tarojs/shared'
import SERVICE_IDENTIFIER from '../constants/identifiers'

import type { Container } from 'inversify'

export default function processPluginHooks (container: Container) {
  const keys = Object.keys(defaultReconciler)
  keys.forEach(key => {
    if (key in SERVICE_IDENTIFIER) {
      // is hooks
      const identifier = SERVICE_IDENTIFIER[key]
      const fn = defaultReconciler[key]

      if (isArray(fn)) {
        // is multi
        fn.forEach(item => container.bind(identifier).toFunction(item))
      } else {
        if (container.isBound(identifier)) {
          // 之前有绑定过，需要重新绑定以覆盖前者
          container.rebind(identifier).toFunction(fn)
        } else {
          container.bind(identifier).toFunction(fn)
        }
      }
    }
  })
}
