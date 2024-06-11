const fs = require('@tarojs/helper').fs

fs.ensureDirSync('./dist/template')

const rs = fs.createReadStream('./src/template/comp.ts')
const ws = fs.createWriteStream('./dist/template/comp.js')

rs.pipe(ws)
