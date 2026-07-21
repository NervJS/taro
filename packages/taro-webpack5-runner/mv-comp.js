const fs = require('@tarojs/helper').fs

fs.ensureDirSync('./dist/template')

fs.createReadStream('./src/template/comp.ts').pipe(
  fs.createWriteStream('./dist/template/comp.js'),
)

fs.createReadStream('./src/template/custom-wrapper.ts').pipe(
  fs.createWriteStream('./dist/template/custom-wrapper.js'),
)

// 方案二：共享运行时 provider 源文件（.js 运行时模板，由 provider 子构建打包，tsc 不处理，直接拷贝）
fs.ensureDirSync('./dist/shared-runtime')
;['entry.sync.js', 'entry.host.js', 'app-shim.js', 'bootstrap.js', 'async-provider.js'].forEach((f) => {
  fs.copyFileSync(`./src/shared-runtime/${f}`, `./dist/shared-runtime/${f}`)
})
