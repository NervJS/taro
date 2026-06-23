import { APP, BODY, HEAD, HTML } from '../constant'
import { TaroDocument } from '../dom/document'
import { window } from './window'

function createDocument (): TaroDocument {
  /**
   * <html>           <--- document.documentElement
   *   <head></head>  <--- document.head
   *   <body>         <--- document.body
   *     <container>
   *       <app id="app" />
   *     </container>
   *   </body>
   * </html>
   */

  const doc = new TaroDocument(window)
  const documentCreateElement = doc.createElement.bind(doc)
  const html = documentCreateElement(HTML)
  const head = documentCreateElement(HEAD)
  const body = documentCreateElement(BODY)
  const container = documentCreateElement('container') // 多包一层主要为了兼容 vue
  const app = documentCreateElement(APP)
  const entryAsync = documentCreateElement('entryAsync')
  app.id = 'app'
  entryAsync.id = 'entryAsync'

  doc.appendChild(html)
  html.appendChild(head)
  html.appendChild(body)
  body.appendChild(container)
  container.appendChild(app)
  container.appendChild(entryAsync)

  doc.documentElement = html
  doc.head = head
  doc.body = body
  doc.container = container
  doc.app = app
  doc.entryAsync = entryAsync

  return doc
}

export const document = createDocument()
