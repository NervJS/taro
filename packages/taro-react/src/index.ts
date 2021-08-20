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

/* eslint-disable @typescript-eslint/no-unused-vars */
import { render, ContainerMap } from './render'
import { TaroReconciler } from './reconciler'
import { TaroElement } from '@tarojs/runtime'
import { ReactNode } from 'react'
import { ensure } from '@tarojs/shared'

const unstable_batchedUpdates = TaroReconciler.batchedUpdates

function unmountComponentAtNode (dom: TaroElement) {
  ensure(dom && [1, 8, 9, 11].includes(dom.nodeType), 'unmountComponentAtNode(...): Target container is not a DOM element.')

  const root = ContainerMap.get(dom)

  if (!root) return false

  unstable_batchedUpdates(() => {
    root.unmount(() => {
      ContainerMap.delete(dom)
    })
  }, null)

  return true
}

function findDOMNode (comp?: TaroElement | ReactNode) {
  if (comp == null) {
    return null
  }

  const nodeType = (comp as TaroElement).nodeType
  if (nodeType === 1 || nodeType === 3) {
    return comp
  }

  return TaroReconciler.findHostInstance(comp as Record<string, any>)
}

const portalType = typeof Symbol === 'function' && Symbol.for
  ? Symbol.for('react.portal')
  : 0xeaca

function createPortal (
  children: ReactNode,
  containerInfo: TaroElement,
  key?: string
) {
  return {
    $$typeof: portalType,
    key: key == null ? null : String(key),
    children,
    containerInfo,
    implementation: null
  }
}

export {
  render,
  unstable_batchedUpdates,
  unmountComponentAtNode,
  findDOMNode,
  createPortal
}

export default {
  render,
  unstable_batchedUpdates,
  unmountComponentAtNode,
  findDOMNode,
  createPortal
}
