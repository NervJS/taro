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

import { inject, injectable } from 'inversify'
import { Shortcuts } from '@tarojs/shared'
import SERVICE_IDENTIFIER from '../constants/identifiers'
import { TaroNode } from './node'
import { NodeType } from './node_types'

import type { TaroNodeImpl } from '../dom-external/node-impl'
import type { InstanceNamedFactory } from '../interface'
import type { Hooks } from '../hooks'

@injectable()
export class TaroText extends TaroNode {
  public _value: string

  public constructor (// eslint-disable-next-line @typescript-eslint/indent
    @inject(SERVICE_IDENTIFIER.TaroNodeImpl) nodeImpl: TaroNodeImpl,
    @inject(SERVICE_IDENTIFIER.TaroElementFactory) getElement: InstanceNamedFactory,
    @inject(SERVICE_IDENTIFIER.Hooks) hooks: Hooks
  ) {
    super(nodeImpl, getElement, hooks)
    this.nodeType = NodeType.TEXT_NODE
    this.nodeName = '#text'
  }

  public set textContent (text: string) {
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
}
