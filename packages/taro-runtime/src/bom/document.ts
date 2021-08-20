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

import { createEvent } from '../dom/event'
import { isBrowser, doc } from '../env'
import ioc_container from '../container'
import SERVICE_IDENTIFIER from '../constants/identifiers'
import { ElementNames, InstanceNamedFactory } from '../interface'
import {
  HTML,
  HEAD,
  BODY,
  APP,
  CONTAINER
} from '../constants'

import type { TaroDocumentInstance } from '../interface'

export function createDocument () {
  /**
   * <document>
   *   <html>
   *     <head></head>
   *     <body>
   *       <container>
   *         <app id="app" />
   *       </container>
   *     </body>
   *   </html>
   * </document>
   */
  const getElement = ioc_container.get<InstanceNamedFactory>(SERVICE_IDENTIFIER.TaroElementFactory)
  const doc = getElement(ElementNames.Document)() as TaroDocumentInstance
  const documentCreateElement = doc.createElement.bind(doc)
  const html = documentCreateElement(HTML)
  const head = documentCreateElement(HEAD)
  const body = documentCreateElement(BODY)
  const app = documentCreateElement(APP)
  app.id = APP
  const container = documentCreateElement(CONTAINER) // 多包一层主要为了兼容 vue

  doc.appendChild(html)
  html.appendChild(head)
  html.appendChild(body)
  body.appendChild(container)
  container.appendChild(app)

  doc.documentElement = html
  doc.head = head
  doc.body = body
  doc.createEvent = createEvent

  return doc
}

export const document = (isBrowser ? doc : createDocument()) as TaroDocumentInstance
