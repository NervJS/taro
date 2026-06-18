const fs = require('fs-extra')
const path = require('path')

export default (ctx, options) => {
  ctx.onBuildFinish(() => {
    console.log('编译结束！')

    const rootPath = path.resolve(__dirname, '../..')
    const miniappPath = path.join(rootPath, 'miniapp')
    const outputPath = path.resolve(__dirname, '../dist')

    // 1. 清理目标目录
    const orderPath = path.join(miniappPath, 'pages/order')
    if (fs.existsSync(orderPath)) {
      fs.removeSync(orderPath)
    }

    // 2. 直接复制整个 pages/order 目录（不需要路径修正了！）
    const srcOrderPath = path.join(outputPath, '')
    if (fs.existsSync(srcOrderPath)) {
      fs.copySync(srcOrderPath, orderPath)
    }

    console.log('orderPath, srcOrderPath :>> ', orderPath, srcOrderPath)
    console.log('拷贝结束！')
  })
}
