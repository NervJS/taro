/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { TaroDocument } from 'src/dom/document'

import {
  APP,
  BODY,
  CONTAINER,
  HEAD,
  HTML
} from '../constants'
import env from '../env'

let document

if (process.env.TARO_ENV && process.env.TARO_ENV !== 'h5') {
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
