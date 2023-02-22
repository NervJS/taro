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
 *  SOFTWARE.
 */

/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line
const fs = require('fs')
// eslint-disable-next-line
const path = require('path')
// eslint-disable-next-line
const parser = require('@babel/parser')
// eslint-disable-next-line
const traverse = require('@babel/traverse').default

const code = fs.readFileSync(path.resolve(__dirname, '../src/api/index.ts')).toString()
console.log('run: generate native api list to taro-rn/apiList.js\n')
console.log('apis is:', code)
const ast = parser.parse(code, { sourceType: 'module', plugins: ['typescript'] })
const apiList = []

traverse(ast, {
  ExportNamedDeclaration(ast) {
    ast.node.specifiers.forEach(spec => apiList.push(spec.local.name))
  }
})

const output = `// 由 getApiList.js 脚本生成, 不要进行手动修改\nmodule.exports = ${JSON.stringify(apiList, null, 2).replace(/"/g, "'")}\n`
fs.writeFileSync(path.resolve(__dirname, '../apiList.js'), output)

console.log('done: generate native api list to taro-rn/apiList.js\n')
