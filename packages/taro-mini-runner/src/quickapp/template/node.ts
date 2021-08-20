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

import parserTag from './tag'
import { uniqTypeof } from './utils'
import { NodeType } from './constant'

const walk = (node) => {
  // 获取quickapp需处理的组件名称
  const tags = parserTag('.', {})
  const component = tags[node.name]
  if (component) {
    // 组件不支持子组件，则将子组件注释
    if (component.subcomponent && (node.children && node.children.length)) {
      node.$delete = true
      node.url = component.url || 'https://doc.quickapp.cn/widgets/common-events.html'
      return
    }

    if (uniqTypeof(component.name) === 'function') {
      node.name = component.name(node)
      const children = node.children
      children && children.forEach(childNode => {
        if (childNode.parent && childNode.parent.name) {
          childNode.parent.name = node.name
        }
      })
    } else {
      node.name = component.name
    }
  }
  const children = node.children
  if (children.length) {
    children.forEach(childNode => {
      walk(childNode)
    })
  }
}

export default function rewriteNode (nodes) {
  const retNodes: NodeType[] = []
  nodes.forEach(node => {
    retNodes.push(node)
  })
  retNodes.forEach(node => walk(node))
  return retNodes
}
