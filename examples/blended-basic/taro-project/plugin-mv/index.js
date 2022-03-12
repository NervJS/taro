const fs = require('fs-extra')
const path = require('path')

export default (ctx, options) => {
  ctx.onBuildFinish(() => {
   
    // Taro v3.1.4
    const blended = ctx.runOpts.blended || ctx.runOpts.options.blended
    
    if (!blended) return

    console.log('编译结束！')

    const rootPath = path.resolve(__dirname, '../..')
    const miniappPath = path.join(rootPath, 'miniapp')
    const outputPath = path.resolve(__dirname, '../dist')
    const destPath = path.join(miniappPath, 'taro')

    if (fs.existsSync(destPath)) {
      fs.removeSync(destPath)
    }
    fs.copySync(outputPath, destPath)

    console.log('拷贝结束！')
  })
}
