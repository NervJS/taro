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

import { Shortcuts } from '@tarojs/shared'

import { MutationObserver, MutationRecordType } from '../dom-external/mutation-observer'
import { TaroNode } from './node'
import { NodeType } from './node_types'

export class TaroText extends TaroNode {
  public _value: string
  public nodeType = NodeType.TEXT_NODE
  public nodeName = '#text'

  constructor (value) {
    super()
    this._value = value
  }

  public set textContent (text: string) {
    MutationObserver.record({
      target: this,
      type: MutationRecordType.CHARACTER_DATA,
      oldValue: this._value
    })
    this._value = text
    this.enqueueUpdate({
      path: `${this._path}.${Shortcuts.Text}`,
      value: text
    })
  }

  public get textContent (): string {
    return this._value
  }

  public set nodeValue (text: string) {
    this.textContent = text
  }

  public get nodeValue (): string {
    return this._value
  }

  public set data (text: string) {
    this.textContent = text
  }

  public get data (): string {
    return this._value
  }
}
