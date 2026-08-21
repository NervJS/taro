const fs = require('fs-extra')
const path = require('path')

// 编译完成后，把 Taro 业务包产物（dist）整体拷进原生宿主 miniapp/taro。
// 共享运行时（split 模式）下产物含同步核 taro-shared-sync.js + 异步核分包 shared-async-v1/，
// 整目录 copySync 会一并带入；宿主 miniapp/app.json 需手工注册业务页与 shared-async-v1 分包。
export default (ctx) => {
  ctx.onBuildFinish(() => {
    const rootPath = path.resolve(__dirname, '../..')
    const miniappPath = path.join(rootPath, 'miniapp')
    const outputPath = path.resolve(__dirname, '../dist')
    const destPath = path.join(miniappPath, 'taro')

    if (fs.existsSync(destPath)) {
      fs.removeSync(destPath)
    }
    fs.copySync(outputPath, destPath)

    console.log('拷贝结束！dist ->', destPath)
  })
}
