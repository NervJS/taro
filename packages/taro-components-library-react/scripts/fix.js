const fs = require('@tarojs/helper').fs
const path = require('path')

const componentsPath = path.resolve(__dirname, '..', 'src/components.ts')

if (fs.existsSync(componentsPath)) {
  const codeBuffer = fs.readFileSync(componentsPath)
  let code = codeBuffer.toString().replace(/const\sTaro([A-Za-z]+)\s=/g, 'const $1 =').replace(/const\s([A-Za-z]+)Core\s=/g, 'const $1 =')

  // NOTE: HTMLStencilElement 与 HTMLTaroInputCoreElement 在 force 参数上冲突
  code = code.replace('createReactComponent<JSX.TaroInputCore, HTMLTaroInputCoreElement>', 'createReactComponent<JSX.TaroInputCore, any>')

  fs.writeFileSync(componentsPath, code)
}
