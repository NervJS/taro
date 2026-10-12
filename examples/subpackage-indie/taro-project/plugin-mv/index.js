const fs = require('fs-extra')
const path = require('path')

module.exports = (ctx) => {
  ctx.onBuildFinish(({ error, stats } = {}) => {
    const { platform, newBlended } = ctx.runOpts.options || {}
    if (platform !== 'weapp' || !newBlended) return
    if (error || !stats || stats.hasErrors()) return

    const outputPath = ctx.paths.outputPath
    const orderPath = path.resolve(__dirname, '../../miniapp/pages/order')
    const entries = ['pages/index/index', 'pages/sub1/index', 'pages/sub2/index']
    const hasEntries = entries.every((entry) =>
      ['.js', '.json', '.wxml'].every((extension) => fs.existsSync(path.join(outputPath, entry + extension)))
    )
    if (!hasEntries) return

    fs.removeSync(orderPath)
    fs.copySync(outputPath, orderPath, {
      filter: (source) => {
        const relative = path.relative(outputPath, source)
        const filename = path.basename(source)
        return relative !== 'app.json' &&
          filename !== 'project.config.json' &&
          filename !== 'project.private.config.json' &&
          !filename.endsWith('.map')
      },
    })
    console.log('微信混合开发产物已复制到 miniapp/pages/order')
  })
}
