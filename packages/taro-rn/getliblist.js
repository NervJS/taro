/* eslint-disable @typescript-eslint/no-var-requires */
// node taro-toolchain/packages/taro-rn/getliblist.js > taro-toolchain/packages/babel-preset-taro/rn/nativeApis.js

const { readdirSync, writeFileSync } = require('fs')
const path = require('path')
const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const info = '// 由taro-rn/getliblist 生成, 请不要手动修改'
const dirs = getDirectories(path.join(__dirname, 'src/lib'))
console.log(`dirs: ${dirs}`)
const fileString = (`${info}
module.exports = ${JSON.stringify(dirs, null, 2).replace(/"/g, "'")}\n`)

// todo
const filePath = path.join(__dirname, './nativeApis.js')

writeFileSync(filePath, fileString)

console.log('done: echo apilist to ./nativeApis.js')

const libString = `${info}
${dirs.map(d => `export * from './${d}'`).join('\n')}
`
const libfilePath = path.join(__dirname, './src/lib/index.ts')

writeFileSync(libfilePath, libString)

console.log('done: echo apilist to taro-rn/src/lib/index.ts')
