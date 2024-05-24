const path = require('path')
const fs = require('fs')
const plugins = require('./constants').plugins

if (process.env.CI &&
  (typeof process.env.CI !== 'string' ||
    process.env.CI.toLowerCase() !== 'false')
) {
  // 判断是否为 CI 环境，CI 环境不走 backup 逻辑，否则两个 wasm 会被覆盖
  return
}

plugins.forEach(plugin => {
  const srcPath = path.join(__dirname, `../swc-backup/${plugin}.wasm`)
  const destPath = path.join(__dirname, `../swc/${plugin}.wasm`)
  fs.access(srcPath, fs.constants.F_OK, err => {
    if (err) return
    fs.copyFile(srcPath, destPath, err => err && console.log('[@tarojs/helper] swc:backup error: ', err))
  })
})
