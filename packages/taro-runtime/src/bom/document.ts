import { isWebPlatform } from '@tarojs/shared'

import {
  APP,
  BODY,
  CONTAINER,
  HEAD,
  HTML
} from '../constants'
import { TaroDocument } from '../dom/document'
import env from '../env'

let document

if (process.env.TARO_ENV && !isWebPlatform()) {
  /* eslint-disable no-inner-declarations */
  function createDocument (): TaroDocument {
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
    const doc = new TaroDocument()
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

    return doc
  }
  document = env.document = createDocument()
} else {
  document = env.document
}

export {
  document
}
