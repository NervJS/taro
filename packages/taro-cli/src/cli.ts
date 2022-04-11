import * as fs from 'fs-extra'
import * as path from 'path'
import * as minimist from 'minimist'
import { Kernel } from '@tarojs/service'
import customCommand from './commands/customCommand'
import { getPkgVersion } from './util'

export default class CLI {
  appPath: string
  constructor (appPath) {
    this.appPath = appPath || process.cwd()
  }

  run () {
    this.parseArgs()
  }

  parseArgs () {
    const args = minimist(process.argv.slice(2), {
      alias: {
        version: ['v'],
        help: ['h'],
        port: ['p'],
        resetCache: ['reset-cache'], // specially for rn, Removes cached files.
        publicPath: ['public-path'], // specially for rn, assets public path.
        bundleOutput: ['bundle-output'], // specially for rn, File name where to store the resulting bundle.
        sourcemapOutput: ['sourcemap-output'], // specially for rn, File name where to store the sourcemap file for resulting bundle.
        sourceMapUrl: ['sourcemap-use-absolute-path'], // specially for rn, Report SourceMapURL using its full path.
        sourcemapSourcesRoot: ['sourcemap-sources-root'], // specially for rn, Path to make sourcemaps sources entries relative to.
        assetsDest: ['assets-dest'] // specially for rn, Directory name where to store assets referenced in the bundle.
      },
      boolean: ['version', 'help']
    })
    const _ = args._
    const command = _[0]
    if (command) {
      const appPath = this.appPath
      const presetsPath = path.resolve(__dirname, 'presets')
      const commandsPath = path.resolve(presetsPath, 'commands')
      const platformsPath = path.resolve(presetsPath, 'platforms')
      const filesPath = path.resolve(presetsPath, 'files')
      const commandPlugins = fs.readdirSync(commandsPath)
      const targetPlugin = `${command}.js`

      // 设置环境变量
      process.env.NODE_ENV ||= args.env || (args.watch ? 'development' : 'production')

      const kernel = new Kernel({
        appPath,
        presets: [],
        plugins: []
      })
      kernel.optsPlugins ||= []

      // 针对不同的内置命令注册对应的命令插件
      if (commandPlugins.includes(targetPlugin)) {
        kernel.optsPlugins.push(path.resolve(commandsPath, targetPlugin))
      }

      switch (command) {
        case 'build': {
          let plugin
          let platform = args.type
          const { publicPath, bundleOutput, sourcemapOutput, sourceMapUrl, sourcemapSourcesRoot, assetsDest } = args

          // 针对不同的内置平台注册对应的端平台插件
          switch (platform) {
            case 'weapp':
            case 'alipay':
            case 'swan':
            case 'tt':
            case 'qq':
            case 'jd':
              kernel.optsPlugins = [
                ...kernel.optsPlugins,
                `@tarojs/plugin-platform-${platform}`,
                path.resolve(filesPath, 'writeFileToDist.js'),
                path.resolve(filesPath, 'generateProjectConfig.js'),
                path.resolve(filesPath, 'generateFrameworkInfo.js')
              ]
              break
            default: {
              // h5, rn
              const platformPlugins = fs.readdirSync(platformsPath)
              const targetPlugin = `${platform}.js`
              if (platformPlugins.includes(targetPlugin)) {
                kernel.optsPlugins.push(path.resolve(platformsPath, targetPlugin))
              }
              break
            }
          }

          // 根据 framework 启用插件
          const framework = kernel.config?.initialConfig.framework
          switch (framework) {
            case 'vue':
              kernel.optsPlugins.push('@tarojs/plugin-framework-vue2')
              break
            case 'vue3':
              kernel.optsPlugins.push('@tarojs/plugin-framework-vue3')
              break
            default:
              kernel.optsPlugins.push('@tarojs/plugin-framework-react')
              break
          }

          // 编译小程序插件
          if (typeof args.plugin === 'string') {
            plugin = args.plugin
            platform = 'plugin'
            kernel.optsPlugins.push(path.resolve(platformsPath, 'plugin.js'))
          }

          customCommand(command, kernel, {
            _,
            platform,
            plugin,
            isWatch: Boolean(args.watch),
            port: args.port,
            env: args.env,
            deviceType: args.platform,
            resetCache: !!args.resetCache,
            publicPath,
            bundleOutput,
            sourcemapOutput,
            sourceMapUrl,
            sourcemapSourcesRoot,
            assetsDest,
            qr: !!args.qr,
            blended: Boolean(args.blended),
            h: args.h
          })
          break
        }
        case 'init': {
          customCommand(command, kernel, {
            _,
            appPath,
            projectName: _[1] || args.name,
            description: args.description,
            typescript: args.typescript,
            templateSource: args['template-source'],
            clone: !!args.clone,
            template: args.template,
            css: args.css,
            h: args.h
          })
          break
        }
        default:
          customCommand(command, kernel, args)
          break
      }
    } else {
      if (args.h) {
        console.log('Usage: taro <command> [options]')
        console.log()
        console.log('Options:')
        console.log('  -v, --version       output the version number')
        console.log('  -h, --help          output usage information')
        console.log()
        console.log('Commands:')
        console.log('  init [projectName]  Init a project with default templete')
        console.log('  config <cmd>        Taro config')
        console.log('  create              Create page for project')
        console.log('  build               Build a project with options')
        console.log('  update              Update packages of taro')
        console.log('  info                Diagnostics Taro env info')
        console.log('  doctor              Diagnose taro project')
        console.log('  inspect             Inspect the webpack config')
        console.log('  convert             Convert native WeiXin-Mini-App to Taro app')
        console.log('  help [cmd]          display help for [cmd]')
      } else if (args.v) {
        console.log(getPkgVersion())
      }
    }
  }
}
