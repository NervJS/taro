/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
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
