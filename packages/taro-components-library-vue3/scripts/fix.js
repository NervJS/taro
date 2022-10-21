const fs = require('@tarojs/helper').fs
const path = require('path')

const fixUtilPath = path.resolve(__dirname, '..', 'src/vue-component-lib/utils.ts')

if (fs.existsSync(fixUtilPath)) {
  const codeBuffer = fs.readFileSync('./src/vue-component-lib/utils.ts')

  fs.writeFileSync(fixUtilPath, codeBuffer.toString().replace('modelProp?: string', 'modelProp = \'\''))
}