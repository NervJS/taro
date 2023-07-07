import { TaroDocument } from '../dom/Document'
import { Window } from './window'

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

  const window = new Window()
  const doc = new TaroDocument(window)
  const documentCreateElement = doc.createElement.bind(doc)
  const html = documentCreateElement('html')
  const head = documentCreateElement('head')
  const body = documentCreateElement('body')
  const container = documentCreateElement('container') // 多包一层主要为了兼容 vue
  const app = documentCreateElement('app')
  app.id = 'app'

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

export const document = createDocument()
