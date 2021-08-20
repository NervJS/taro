/*
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
