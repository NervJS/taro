const fs = require('fs-extra')

fs.ensureDirSync('./dist/template')

fs.createReadStream('./src/template/comp.ts')
  .pipe(fs.createWriteStream('./dist/template/comp.js'))

fs.createReadStream('./src/template/custom-wrapper.ts')
  .pipe(fs.createWriteStream('./dist/template/custom-wrapper.js'))
