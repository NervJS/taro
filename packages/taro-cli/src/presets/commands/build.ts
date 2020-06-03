import configValidator from '../../doctor/configValidator'

export default (ctx) => {
  registerBuildHooks(ctx)
  ctx.registerCommand({
    name: 'build',
    optionsMap: {
      '--type [typeName]': 'Build type, weapp/swan/alipay/tt/h5/quickapp/rn/qq/jd',
      '--watch': 'Watch mode',
      '--page [pagePath]': 'Build one page',
      '--component [pagePath]': 'Build one component',
      '--env [env]': 'Env type',
      '--ui': 'Build Taro UI library',
      '--ui-index [uiIndexPath]': 'Index file for build Taro UI library',
      '--plugin [typeName]': 'Build Taro plugin project, weapp',
      '--port [port]': 'Specified port',
      '--release': 'Release quickapp'
    },
    async fn (opts) {
      const { platform, config } = opts
      const { fs, chalk, PROJECT_CONFIG } = ctx.helper
      const { outputPath, configPath } = ctx.paths
      const { isWatch, envHasBeenSet } = ctx.runOpts
      if (!fs.existsSync(configPath)) {
        console.log(chalk.red(`找不到项目配置文件${PROJECT_CONFIG}，请确定当前目录是 Taro 项目根目录!`))
        process.exit(1)
      }
      const checkResult = await checkConfig({
        configPath,
        projectConfig: ctx.initialConfig
      })
      await checkPlugin(ctx, isWatch)
      if (checkResult.lines.length) {
        const NOTE_VALID = chalk.yellow('[!] ')
        const NOTE_INVALID = chalk.red('[✗] ')

        const lineChalk = chalk.hex('#fff')
        const errorChalk = chalk.hex('#f00')
        console.log(errorChalk(`Taro 配置有误，请检查！ (${configPath})`))
        checkResult.lines.forEach(line => {
          console.log(
            '  ' +
            (line.valid ? NOTE_VALID : NOTE_INVALID) +
            lineChalk(line.desc)
          )
        })
      }
      if (typeof platform !== 'string') {
        console.log(chalk.red('请传入正确的编译类型！'))
        process.exit(0)
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
              await ctx.applyPlugins({
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
            async onBuildFinish ({ error, stats, isWatch }) {
              await ctx.applyPlugins({
                name: 'onBuildFinish',
                opts: {
                  error,
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

async function checkConfig ({ projectConfig, configPath }) {
  const result = await configValidator({
    configPath,
    projectConfig
  })
  return result
}

function findFilesWithExt (dirname, ext) {
  const glob = require('glob')
  const pattern = Array.isArray(ext) ? `${dirname}/**/*{${ext.join(',')}}` : `${dirname}/**/*${ext}`
  const files = glob.sync(pattern)
  return files
}

const PLUGIN_SASS = '@tarojs/plugin-sass'
const PLUGIN_LESS = '@tarojs/plugin-less'
const PLUGIN_STYLUS = '@tarojs/plugin-stylus'
const PLUGIN_UGLIFY = '@tarojs/plugin-uglify'
const PLUGIN_TERSER = '@tarojs/plugin-terser'

const PLUGINS_CONFIG_DOC = 'https://nervjs.github.io/taro/docs/config-detail#plugins'

function hadAddPlugin (plugins, pluginName) {
  let hadAdd = false
  plugins.forEach(item => {
    if (item.id === pluginName || item.name === pluginName) {
      hadAdd = true
    }
  })
  return hadAdd
}

async function checkPlugin (ctx, isWatch) {
  const plugins = ctx.plugins
  const sassFiles = findFilesWithExt(ctx.paths.sourcePath, ['.scss', '.sass'])
  if (sassFiles.length && !hadAddPlugin(plugins, PLUGIN_SASS)) {
    console.log()
    console.log(ctx.helper.chalk.red(`当前项目使用了 sass，请安装插件 ${PLUGIN_SASS}，并且在 plugins 中进行配置，否则将无法编译 sass 文件！`))
    console.log(ctx.helper.chalk.red(`参考文档：${PLUGINS_CONFIG_DOC}`))
    console.log()
    process.exit(1)
  }

  const lessFiles = findFilesWithExt(ctx.paths.sourcePath, '.less')
  if (lessFiles.length && !hadAddPlugin(plugins, PLUGIN_LESS)) {
    console.log()
    console.log(ctx.helper.chalk.red(`当前项目使用了 sass，请安装插件 ${PLUGIN_LESS}，并且在 plugins 中进行配置，否则将无法编译 less 文件！`))
    console.log(ctx.helper.chalk.red(`参考文档：${PLUGINS_CONFIG_DOC}`))
    console.log()
    process.exit(1)
  }

  const stylusFiles = findFilesWithExt(ctx.paths.sourcePath, '.styl')
  if (stylusFiles.length && !hadAddPlugin(plugins, PLUGIN_STYLUS)) {
    console.log()
    console.log(ctx.helper.chalk.red(`当前项目使用了 sass，请安装插件 ${PLUGIN_STYLUS}，并且在 plugins 中进行配置，否则将无法编译 stylus 文件！`))
    console.log(ctx.helper.chalk.red(`参考文档：${PLUGINS_CONFIG_DOC}`))
    console.log()
    process.exit(1)
  }

  if (!isWatch) {
    if (!hadAddPlugin(plugins, PLUGIN_UGLIFY) && !hadAddPlugin(plugins, PLUGIN_TERSER)) {
      console.log()
      console.log(ctx.helper.chalk.yellow(`检测到当前项目没有安装压缩插件 ${PLUGIN_UGLIFY} 或 ${PLUGIN_TERSER}，打包时将无法压缩 JS 代码，请安装插件（安装其一即可），并且在 plugins 中进行配置！`))
      console.log(ctx.helper.chalk.yellow(`参考文档：${PLUGINS_CONFIG_DOC}`))
      console.log()
    }
  }
}
