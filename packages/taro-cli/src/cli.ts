import * as path from 'path'

import * as minimist from 'minimist'
import { Kernel } from '@tarojs/service'

import build from './commands/build'
import init from './commands/init'
import convert from './commands/convert'
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
        port: ['p']
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
          build(kernel, {
            platform: args.type,
            isWatch: !!args.watch,
            port: args.port,
            env: args.env,
            release: args.release,
            ui: args.ui,
            uiIndex: args.uiIndex,
            page: args.page,
            component: args.component,
            plugin: args.plugin,
            isHelp: args.h
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
        case 'convert': {
          convert(kernel, {
            appPath: this.appPath,
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
        console.log('  help [cmd]          display help for [cmd]')
      } else if (args.v) {
        console.log(getPkgVersion())
      }
    }
  }
}
