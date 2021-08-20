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
