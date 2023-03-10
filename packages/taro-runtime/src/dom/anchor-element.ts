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

import { parseUrl } from '../bom/URL'
import { TaroElement } from './element'

const enum AnchorElementAttrs {
  HREF = 'href',
  PROTOCOL = 'protocol',
  HOST = 'host',
  SEARCH = 'search',
  HASH = 'hash',
  HOSTNAME = 'hostname',
  PORT = 'port',
  PATHNAME = 'pathname'
}

export class AnchorElement extends TaroElement {
  public get href () {
    return this.props[AnchorElementAttrs.HREF] ?? ''
  }

  public set href (val: string) {
    this.setAttribute(AnchorElementAttrs.HREF, val)
  }

  get protocol () {
    return this.props[AnchorElementAttrs.PROTOCOL] ?? ''
  }

  get host () {
    return this.props[AnchorElementAttrs.HOST] ?? ''
  }

  get search () {
    return this.props[AnchorElementAttrs.SEARCH] ?? ''
  }

  get hash () {
    return this.props[AnchorElementAttrs.HASH] ?? ''
  }

  get hostname () {
    return this.props[AnchorElementAttrs.HOSTNAME] ?? ''
  }

  get port () {
    return this.props[AnchorElementAttrs.PORT] ?? ''
  }

  get pathname () {
    return this.props[AnchorElementAttrs.PATHNAME] ?? ''
  }

  public setAttribute (qualifiedName: string, value: any): void {
    if (qualifiedName === AnchorElementAttrs.HREF) {
      const willSetAttr = parseUrl(value)
      for (const k in willSetAttr) {
        super.setAttribute(k, willSetAttr[k])
      }
    } else {
      super.setAttribute(qualifiedName, value)
    }
  }

}
