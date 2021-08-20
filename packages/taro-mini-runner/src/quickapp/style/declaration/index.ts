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

import * as fs from 'fs-extra'
import * as path from 'path'

export const declarations = {}
parse('.')

function parse (dir) {
  dir = dir || '.'
  const dirPath = path.join(__dirname, dir)
  fs.readdirSync(dirPath).forEach(file => {
    const filePath = path.join(dirPath, file)
    if (fs.statSync(filePath).isFile()) {
      if (path.extname(filePath) === '.js') {
        Object.assign(declarations, require(filePath).default)
      }
    } else {
      parse(path.join(dir, file))
    }
  })
}

export default function rewriter (declaration, rule, output) {
  if (!declaration.position) {
    declaration.position = {
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 1,
        column: 1
      }
    }
  }
  if (declaration.property.indexOf('-webkit-') === 0) {
    declaration.property = declaration.property.replace('-webkit-', '')
  }

  if (declarations.hasOwnProperty(declaration.property)) {
    let processDeclaration = declarations[declaration.property]
    if (typeof processDeclaration === 'function') {
      // 将样式名作为函数名处理样式值
      processDeclaration = processDeclaration(declaration.value, declaration, function (property, value) {
        output.declaration.inserted.push({
          property,
          value
        })
      }, rule)
    }
    if (Array.isArray(processDeclaration)) { // 直接增加一组
      output.declaration.inserted.concat(processDeclaration)
    } else if (typeof processDeclaration === 'object') { // 直接增加一条
      output.declaration.inserted.push(processDeclaration)
    } else if (typeof processDeclaration === 'string') {
      if (processDeclaration.indexOf('I:') === 0) { // 删除
        output.declaration.deleted.push(declaration)
      } else if (processDeclaration.indexOf('W:') === 0) { // 警告
        output.declaration.deleted.push(declaration)
      } else if (processDeclaration.indexOf('E:') === 0) { // 错误
        output.declaration.deleted.push(declaration)
        const msg = 'E: 样式`' + declaration.property + ':' + declaration.value + '`不支持'
        output.logs.push({
          reason: msg,
          line: declaration.position.start.line,
          column: declaration.position.start.column
        })
      }
    }
  } else {
    output.declaration.deleted.push(declaration)
  }
}
