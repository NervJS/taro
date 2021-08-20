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

import type { TaroElement } from './element'

export class ClassList extends Set<string> {
  private el: TaroElement

  constructor (className: string, el: TaroElement) {
    super()
    className.trim().split(/\s+/).forEach(super.add.bind(this))
    this.el = el
  }

  public get value () {
    return [...this].join(' ')
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
