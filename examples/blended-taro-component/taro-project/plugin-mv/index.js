const fs = require('fs-extra')
const path = require('path')

export default (ctx, options) => {
  ctx.onBuildFinish(() => {
    const isBuildComponent = ctx.runOpts._[1]

    if (!isBuildComponent) return

    console.log('编译结束！')

    const rootPath = path.resolve(__dirname, '../..')
    const isH5 = process.env.TARO_PLATFORM === 'web'
    const appPath = path.join(rootPath, isH5 ? 'h5/src' : 'miniapp')
    const outputPath = path.resolve(__dirname, '../dist')
    const destPath = path.join(appPath, 'taro')

    if (fs.existsSync(destPath)) {
      fs.removeSync(destPath)
    }
    fs.copySync(outputPath, destPath)

    console.log('拷贝结束！')
  })
}
