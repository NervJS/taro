const fs = require('@tarojs/helper').fs
const path = require('path')

const componentsPath = path.resolve(__dirname, '..', 'src/components.ts')
const utilsPath = path.resolve(__dirname, '..', 'src/vue-component-lib/utils.ts')

if (fs.existsSync(componentsPath)) {
  const codeBuffer = fs.readFileSync(componentsPath)
  const code = codeBuffer.toString().replace(/const\sTaro([A-Za-z]+)\s=/g, 'const $1 =').replace(/const\s([A-Za-z]+)Core\s=/g, 'const $1 =')

  fs.writeFileSync(componentsPath, code)
}

if (fs.existsSync(utilsPath)) {
  const codeBuffer = fs.readFileSync(utilsPath)
  // Note: 移除事件不必要的定义
  let code = codeBuffer.toString().replace(/let[\s\S]*vueElement\.\$emit\(eventName,\semittedValue\);/, 'vueElement.$emit(eventName, event);')
  // Note: 为 click 事件绑定 tap 事件
  code = codeBuffer.toString().replace(/on: allListeners/g, `on: { ...allListeners, click: (event) => { typeof allListeners.click === 'function' && click(event); vueElement.$emit('tap', event); } }`)

  fs.writeFileSync(utilsPath, code)
}
