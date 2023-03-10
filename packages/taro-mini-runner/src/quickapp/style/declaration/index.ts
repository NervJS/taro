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
