const fs = require('@tarojs/helper').fs

fs.ensureDirSync('./dist/template')

fs.createReadStream('./src/template/comp.ts').pipe(
  fs.createWriteStream('./dist/template/comp.js'),
)

fs.createReadStream('./src/template/custom-wrapper.ts').pipe(
  fs.createWriteStream('./dist/template/custom-wrapper.js'),
)

// 共享运行时（split 模式）手写 .js 运行时模板：由 provider 子构建打包，tsc 不处理，原样拷进产物。
// 只拷 .js（.ts 常量/逻辑文件走 tsc 正常编译到 dist）。
fs.copySync('./src/shared-runtime', './dist/shared-runtime', {
  filter: (src) => fs.statSync(src).isDirectory() || src.endsWith('.js'),
})
