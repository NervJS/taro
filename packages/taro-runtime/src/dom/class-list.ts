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

import type { TaroElement } from './element'

export class ClassList extends Set<string> {
  private el: TaroElement

  constructor (className: string, el: TaroElement) {
    super()
    className.trim().split(/\s+/).forEach(super.add.bind(this))
    this.el = el
  }

  public get value () {
    return [...this].filter(v => v !== '').join(' ')
  }

  public add (s: string) {
    super.add(s)
    this._update()

    return this
  }

  public get length (): number {
    return this.size
  }

  public remove (s: string) {
    super.delete(s)
    this._update()
  }

  public toggle (s: string) {
    if (super.has(s)) {
      super.delete(s)
    } else {
      super.add(s)
    }

    this._update()
  }

  public replace (s1: string, s2: string) {
    super.delete(s1)
    super.add(s2)

    this._update()
  }

  public contains (s: string) {
    return super.has(s)
  }

  public toString () {
    return this.value
  }

  private _update () {
    this.el.className = this.value
  }
}
