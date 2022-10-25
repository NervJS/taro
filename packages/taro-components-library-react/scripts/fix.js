const fs = require('@tarojs/helper').fs
const path = require('path')

const fixUtilPath = path.resolve(__dirname, '..', 'src/components.ts')

if (fs.existsSync(fixUtilPath)) {
  const codeBuffer = fs.readFileSync(fixUtilPath)

  fs.writeFileSync(fixUtilPath, codeBuffer.toString().replace(/const Taro([A-Za-z]+)Core =/g, 'const $1 ='))
}