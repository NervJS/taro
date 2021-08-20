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

import { ContainerModule } from 'inversify'
import SERVICE_IDENTIFIER from '../constants/identifiers'
import { setInnerHTML } from './inner-html/html'
import { getBoundingClientRectImpl } from './element'
import { insertAdjacentHTMLImpl } from './node'

// webpack define plugin
declare const ENABLE_INNER_HTML: boolean
declare const ENABLE_ADJACENT_HTML: boolean
declare const ENABLE_SIZE_APIS: boolean

const domExternal = new ContainerModule(bind => {
  if (process.env.TARO_ENV !== 'h5') {
    if (typeof ENABLE_INNER_HTML !== 'undefined' && ENABLE_INNER_HTML) {
      bind(SERVICE_IDENTIFIER.InnerHTMLImpl).toFunction(setInnerHTML)
      if (typeof ENABLE_ADJACENT_HTML !== 'undefined' && ENABLE_ADJACENT_HTML) {
        bind(SERVICE_IDENTIFIER.insertAdjacentHTMLImpl).toFunction(insertAdjacentHTMLImpl)
      }
    }
    if (typeof ENABLE_SIZE_APIS !== 'undefined' && ENABLE_SIZE_APIS) {
      bind(SERVICE_IDENTIFIER.getBoundingClientRectImpl).toFunction(getBoundingClientRectImpl)
    }
  }
})

export default domExternal
