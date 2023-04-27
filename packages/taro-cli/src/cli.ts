import { fs } from '@tarojs/helper'
import { Kernel } from '@tarojs/service'
import * as minimist from 'minimist'
import * as path from 'path'

import customCommand from './commands/customCommand'
import { dotenvParse, getPkgVersion, patchEnv } from './util'

const DISABLE_GLOBAL_CONFIG_COMMANDS = ['build', 'global-config', 'doctor', 'update', 'config']

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
        assetsDest: ['assets-dest'], // specially for rn, Directory name where to store assets referenced in the bundle.
        envPrefix: ['env-prefix'],
      },
      boolean: ['version', 'help', 'disable-global-config']
    })
    const _ = args._
    const command = _[0]
    if (command) {
      const appPath = this.appPath
      const presetsPath = path.resolve(__dirname, 'presets')
      const commandsPath = path.resolve(presetsPath, 'commands')
      const platformsPath = path.resolve(presetsPath, 'platforms')
      const commandPlugins = fs.readdirSync(commandsPath)
      const targetPlugin = `${command}.js`

      // 设置环境变量
      process.env.NODE_ENV ||= args.env
      if (process.env.NODE_ENV === 'undefined' && (command === 'build' || command === 'inspect')) {
        process.env.NODE_ENV = (args.watch ? 'development' : 'production')
      }
      args.type ||= args.t
      if (args.type) {
        process.env.TARO_ENV = args.type
      }
      if (typeof args.plugin === 'string') {
        process.env.TARO_ENV = 'plugin'
      }
      // 这里解析 dotenv 以便于 config 解析时能获取 dotenv 配置信息
      const expandEnv = dotenvParse(appPath, args.envPrefix, args.mode || process.env.NODE_ENV)

      const disableGlobalConfig = !!(args['disable-global-config'] || DISABLE_GLOBAL_CONFIG_COMMANDS.includes(command))

      const kernel = new Kernel({
        appPath,
        presets: [
          path.resolve(__dirname, '.', 'presets', 'index.js')
        ],
        disableGlobalConfig,
        plugins: []
      })
      kernel.optsPlugins ||= []

      // 将自定义的 变量 添加到 config.env 中，实现 definePlugin 字段定义
      const initialConfig = kernel.config?.initialConfig
      if(initialConfig) {
        initialConfig.env = patchEnv(initialConfig, expandEnv)
      }

      // 针对不同的内置命令注册对应的命令插件
      if (commandPlugins.includes(targetPlugin)) {
        kernel.optsPlugins.push(path.resolve(commandsPath, targetPlugin))
      }

      // 把内置命令插件传递给 kernel，可以暴露给其他插件使用
      kernel.cliCommandsPath = commandsPath
      kernel.cliCommands = commandPlugins
        .filter(commandFileName => /^[\w-]+(\.[\w-]+)*\.js$/.test(commandFileName))
        .map(fileName => fileName.replace(/\.js$/, ''))

      switch (command) {
        case 'inspect':
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
            case 'h5':
              kernel.optsPlugins.push(`@tarojs/plugin-platform-${platform}`)
              break
            default: {
              // plugin, rn
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
            if (plugin === 'weapp' || plugin === 'alipay') {
              kernel.optsPlugins.push(`@tarojs/plugin-platform-${plugin}`)
            }
          }

          // 传递 inspect 参数即可
          if (command === 'inspect') {
            customCommand(command, kernel, args)
            break
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
            framework: args.framework,
            compiler: args.compiler,
            npm: args.npm,
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
        console.log('  help [cmd]          display help for [cmd]')
      } else if (args.v) {
        console.log(getPkgVersion())
      }
    }
  }
}
