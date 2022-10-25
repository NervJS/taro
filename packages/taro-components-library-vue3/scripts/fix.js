const fs = require('@tarojs/helper').fs
const path = require('path')

const componentsPath = path.resolve(__dirname, '..', 'src/components.ts')

if (fs.existsSync(componentsPath)) {
  const codeBuffer = fs.readFileSync(componentsPath)

  fs.writeFileSync(componentsPath, codeBuffer.toString().replace(/const Taro([A-Za-z]+)Core =/g, 'const $1 ='))
}
