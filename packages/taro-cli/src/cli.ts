import * as path from 'path'

import * as minimist from 'minimist'
import { Kernel } from '@tarojs/service'

import init from './commands/init'
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
        help: ['h']
      },
      boolean: ['version', 'help']
    })
    const _ = args._
    const command = _[0]
    if (command) {
      const kernel = new Kernel({
        appPath: this.appPath,
        presets: [
          path.resolve(__dirname, '.', 'presets', 'index.js')
        ]
      })
      switch (command) {
        case 'build': {
          kernel.optsPlugins = [
            '@tarojs/plugin-platform-weapp',
            '@tarojs/plugin-platform-alipay',
            '@tarojs/plugin-platform-swan',
            '@tarojs/plugin-platform-tt',
            '@tarojs/plugin-platform-qq',
            '@tarojs/plugin-platform-jd'
          ]
          customCommand('build', kernel, {
            _: [],
            platform: args.type,
            isWatch: Boolean(args.watch),
            port: args.port,
            env: args.env,
            blended: Boolean(args.blended),
            h: args.h
          })
          break
        }
        case 'init': {
          const projectName = _[1] || args.name
          init(kernel, {
            appPath: this.appPath,
            projectName,
            typescript: args.typescript,
            templateSource: args['template-source'],
            clone: !!args.clone,
            template: args.template,
            css: args.css,
            isHelp: args.h
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
