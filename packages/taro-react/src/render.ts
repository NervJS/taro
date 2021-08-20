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

import { TaroElement } from '@tarojs/runtime'
import { ReactNode } from 'react'
import { TaroReconciler } from './reconciler'
import { OpaqueRoot } from 'react-reconciler'

export const ContainerMap: WeakMap<TaroElement, Root> = new WeakMap()

type Renderer = typeof TaroReconciler

export type Callback = () => void | null | undefined

class Root {
  private renderer: Renderer
  private internalRoot: OpaqueRoot

  public constructor (renderer: Renderer, domContainer: TaroElement) {
    this.renderer = renderer
    this.internalRoot = renderer.createContainer(domContainer, 0/** LegacyRoot: react-reconciler/src/ReactRootTags.js */, false, null)
  }

  public render (children: ReactNode, cb: Callback) {
    this.renderer.updateContainer(children, this.internalRoot, null, cb)

    return this.renderer.getPublicRootInstance(this.internalRoot)
  }

  public unmount (cb: Callback) {
    this.renderer.updateContainer(null, this.internalRoot, null, cb)
  }
}

export function render (element: ReactNode, domContainer: TaroElement, cb: Callback) {
  const oldRoot = ContainerMap.get(domContainer)
  if (oldRoot != null) {
    return oldRoot.render(element, cb)
  }

  const root = new Root(TaroReconciler, domContainer)
  ContainerMap.set(domContainer, root)
  return root.render(element, cb)
}
