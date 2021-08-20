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

import { Shortcuts, toCamelCase } from '@tarojs/shared'
import { isText, isHasExtractProp, isComment } from './utils'
import {
  VIEW,
  CLASS,
  STYLE,
  ID,
  PURE_VIEW,
  CATCHMOVE,
  CATCH_VIEW
} from './constants'

import type { MiniData, MiniElementData } from './interface'
import type { TaroElement } from './dom/element'
import type { TaroText } from './dom/text'

/**
 * React also has a fancy function's name for this: `hydrate()`.
 * You may have been heard `hydrate` as a SSR-related function,
 * actually, `hydrate` basicly do the `render()` thing, but ignore some properties,
 * it's a vnode traverser and modifier: that's exactly what Taro's doing in here.
 */
export function hydrate (node: TaroElement | TaroText): MiniData {
  const nodeName = node.nodeName

  if (isText(node)) {
    return {
      [Shortcuts.Text]: node.nodeValue,
      [Shortcuts.NodeName]: nodeName
    }
  }

  const data: MiniElementData = {
    [Shortcuts.NodeName]: nodeName,
    uid: node.uid
  }
  const { props } = node
  const SPECIAL_NODES = node.hooks.getSpecialNodes()

  if (!node.isAnyEventBinded() && SPECIAL_NODES.indexOf(nodeName) > -1) {
    data[Shortcuts.NodeName] = `static-${nodeName}`
    if (nodeName === VIEW && !isHasExtractProp(node)) {
      data[Shortcuts.NodeName] = PURE_VIEW
    }
  }

  for (const prop in props) {
    const propInCamelCase = toCamelCase(prop)
    if (
      !prop.startsWith('data-') && // 在 node.dataset 的数据
      prop !== CLASS &&
      prop !== STYLE &&
      prop !== ID &&
      propInCamelCase !== CATCHMOVE
    ) {
      data[propInCamelCase] = props[prop]
    }
    if (nodeName === VIEW && propInCamelCase === CATCHMOVE && props[prop] !== false) {
      data[Shortcuts.NodeName] = CATCH_VIEW
    }
  }

  let { childNodes } = node

  // 过滤 comment 节点
  childNodes = childNodes.filter(node => !isComment(node))

  if (childNodes.length > 0) {
    data[Shortcuts.Childnodes] = childNodes.map(hydrate)
  } else {
    data[Shortcuts.Childnodes] = []
  }

  if (node.className !== '') {
    data[Shortcuts.Class] = node.className
  }

  if (node.cssText !== '' && nodeName !== 'swiper-item') {
    data[Shortcuts.Style] = node.cssText
  }

  node.hooks.modifyHydrateData?.(data)

  return data
}
