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
  // Note: 事件优化代码
  const eventCode = `vueElement.$emit(eventName, event); if (['input', 'change'].includes(eventName)) vueElement.$emit('update:modelValue', event.detail.value);`
  // Note: click 事件绑定 tap 事件触发
  const listenersCode = `on: { ...allListeners, click: (event) => { typeof allListeners.click === 'function' && allListeners.click(event); vueElement.$emit('tap', event); } }`
  const code = codeBuffer.toString()
    .replace(/let[\s\S]*vueElement\.\$emit\(eventName,\semittedValue\);/, eventCode)
    .replace(/on: allListeners/g, listenersCode)

  fs.writeFileSync(utilsPath, code)
}
