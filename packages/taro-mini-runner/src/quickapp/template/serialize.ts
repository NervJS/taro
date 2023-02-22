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

import { addComment } from './utils'

const ATTRS_NAME = ['checked', 'disabled']

const createAttrsCode = (attrs) => {
  if (!attrs) {
    return ''
  }
  let attrsCode = ''
  const attrsKey = Object.keys(attrs)
  if (attrsKey.length) {
    attrsCode = ' ' + attrsKey.map(name => {
      if (!attrs[name] && ~ATTRS_NAME.indexOf(name)) {
        return `${name}='true'`
      }
      return name === 'else' ? `${name}` : `${name}='${attrs[name]}'`
    }).join(' ')
  }
  return attrsCode
}

const createNodeCode = (name, children, content, attrsCode, $delete, url) => {
  let childrenNodes = children.map(childNode => {
    return walk(childNode)
  }).join('')
  // 针对不支持子组件的组件，子组件需注释
  childrenNodes = $delete ? addComment(childrenNodes, url) : childrenNodes
  return `<${name}${attrsCode}>${content || ''}${childrenNodes}</${name}>`
}

const walk = (node) => {
  const attrsCode = createAttrsCode(node.attributes)
  const nodeCode = createNodeCode(
    node.name,
    node.children,
    node.content,
    attrsCode,
    node.$delete,
    node.url
  )
  return nodeCode
}

export default function serialize (nodes) {
  if (!Array.isArray(nodes)) {
    nodes = [nodes]
  }
  const code = nodes.map(node => walk(node)).join('\r\n')
  return code
}
