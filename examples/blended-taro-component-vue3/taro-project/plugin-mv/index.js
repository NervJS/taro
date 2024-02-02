const fs = require('fs-extra')
const path = require('path')

export default (ctx, options) => {
  ctx.onBuildFinish(() => {
    const isBuildComponent = ctx.runOpts._[1]

    if (!isBuildComponent) return

    console.log('编译结束！')

    const rootPath = path.resolve(__dirname, '../..')
    const isH5 = process.env.TARO_PLATFORM === 'web'

    if (isH5) {
      const appPath = path.join(rootPath, 'h5/src')
      const htmlAppPath = path.join(rootPath, 'h5-html/src')

      const destPath = path.join(appPath, 'taro')
      const htmlDestPath = path.join(htmlAppPath, 'taro')
  
      if (fs.existsSync(destPath)) {
        fs.removeSync(destPath)
      }
      
      const outputPath = path.resolve(__dirname, '../dist')
      
      fs.copySync(outputPath, destPath)
      fs.copySync(outputPath, htmlDestPath)
    } else {
      const appPath = path.join(rootPath, 'miniapp')
      const outputPath = path.resolve(__dirname, '../dist')
      const destPath = path.join(appPath, 'taro')
  
      if (fs.existsSync(destPath)) {
        fs.removeSync(destPath)
      }
      fs.copySync(outputPath, destPath)
    }
    
    console.log('拷贝结束！')
  })
}
