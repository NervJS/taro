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

import { NodeType } from './constant'
const sax = require('sax')

export default function parseCode (code: string): NodeType {
  const parser = sax.parser(false, {
    trim: true,
    lowercase: true,
    position: true
  })

  let root
  let currentParent
  const stack: any[] = []

  parser.onerror = function (e) {
    console.log(e)
  }

  parser.oncdata = function (t) {
    currentParent && (currentParent.content = t.trim() || '')
  }

  parser.ontext = function (t) {
    currentParent && (currentParent.content = t.trim() || '')
  }

  parser.onopentag = function (node) {
    node.children = []
    node.location = {
      line: this.line,
      column: this.column
    }
    if (!root) {
      root = node
    }
    if (currentParent) {
      node.parent = currentParent
      currentParent.children.push(node)
    }
    currentParent = node
    stack.push(currentParent)
  }

  parser.onclosetag = function () {
    stack.length -= 1
    currentParent = stack[stack.length - 1]
  }

  parser.write(code).close()

  return root
}
