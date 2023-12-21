const path = require('path')
const fs = require('fs')

const plugins = [
  'swc_plugin_compile_mode',
]

plugins.forEach(plugin => {
  const srcPath = path.join(__dirname, `../../../crates/native_binding/artifacts/wasm-wasi-swc_plugins/${plugin}.wasm`)
  const destPath = path.join(__dirname, `../swc/${plugin}.wasm`)
  fs.copyFile(srcPath, destPath, err => err && console.log('[@tarojs/helper] artifacts error: ', err))
})
