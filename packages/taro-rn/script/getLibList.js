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
// node packages/taro-rn/getliblist.js > packages/taro-rn/libList.js

const { readdirSync, writeFileSync } = require('fs')
const path = require('path')
const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const info = '// 由 getLibList.js 脚本生成, 不要进行手动修改, 请不要手动修改'
const dirs = getDirectories(path.join(__dirname, '../src/lib'))
console.log(`dirs: ${dirs}\n`)
const fileString = (`${info}
module.exports = ${JSON.stringify(dirs, null, 2).replace(/"/g, "'")}\n`)

// todo
const filePath = path.join(__dirname, '../libList.js')

writeFileSync(filePath, fileString)

console.log('done: echo native lib list to taro-rn/libList.js\n')

const libString = `${info}
${dirs.map(d => `export * from './${d}'`).join('\n')}
`
const libfilePath = path.join(__dirname, '../src/lib/index.ts')

writeFileSync(libfilePath, libString)

console.log('done: echo export native lib list to taro-rn/src/lib/index.ts\n')
