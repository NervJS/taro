export default (ctx) => {
  registerBuildHooks(ctx)
  ctx.registerCommand({
    name: 'build',
    async fn (opts) {
      const { platform, config } = opts
      const { fs, chalk } = ctx.helper
      const { outputPath } = ctx.paths
      const { isWatch, envHasBeenSet } = ctx.runOpts
      if (typeof platform !== 'string') {
        console.log(chalk.red('请传入正确的编译类型！'))
        process.exit(0)
      }
      if (isWatch) {
        process.env.NODE_ENV = 'development'
      } else {
        process.env.NODE_ENV = 'production'
      }
      process.env.TARO_ENV = platform
      fs.ensureDirSync(outputPath)
      let isProduction = false
      if (!envHasBeenSet) {
        isProduction = process.env.NODE_ENV === 'production' || !isWatch
      }

      await ctx.applyPlugins('onBuildStart')
      await ctx.applyPlugins({
        name: platform,
        opts: {
          config: {
            ...config,
            isWatch,
            mode: isProduction ? 'production': 'development',
            async modifyWebpackChain (chain, webpack) {
              ctx.applyPlugins({
                name: 'modifyWebpackChain',
                initialVal: chain,
                opts: {
                  chain,
                  webpack
                }
              })
            },
            async modifyBuildAssets (assets) {
              await ctx.applyPlugins({
                name: 'modifyBuildAssets',
                initialVal: assets,
                opts: {
                  assets
                }
              })
            },
            async modifyBuildTempFileContent (tempFiles) {
              await ctx.applyPlugins({
                name: 'modifyBuildTempFileContent',
                initialVal: tempFiles,
                opts: {
                  tempFiles
                }
              })
            },
            async onBuildFinish (err, stats, isWatch) {
              await ctx.applyPlugins({
                name: 'onBuildFinish',
                opts: {
                  err,
                  stats,
                  isWatch
                }
              })
            }
          }
        }
      })
    }
  })
}

function registerBuildHooks (ctx) {
  [
    'modifyWebpackChain',
    'modifyBuildAssets',
    'modifyBuildTempFileContent',
    'onBuildStart',
    'onBuildFinish'
  ].forEach(methodName => {
    ctx.registerMethod(methodName)
  })
}