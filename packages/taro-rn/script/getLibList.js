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
