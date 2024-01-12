const path = require('path')
const fs = require('fs')
const plugins = require('./constants').plugins

plugins.forEach(plugin => {
  const srcPath = path.join(__dirname, `../swc-backup/${plugin}.wasm`)
  const destPath = path.join(__dirname, `../swc/${plugin}.wasm`)
  fs.access(srcPath, fs.constants.F_OK, err => {
    if (err) return
    fs.copyFile(srcPath, destPath, err => err && console.log('[@tarojs/helper] swc:backup error: ', err))
  })
})
