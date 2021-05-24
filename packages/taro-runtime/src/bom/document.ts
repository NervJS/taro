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
