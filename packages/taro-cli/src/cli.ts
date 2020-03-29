import * as path from 'path'

import * as minimist from 'minimist'
import { Kernel } from '@tarojs/service'

import build from './commands/build'
import init from './commands/init'
import create from './commands/create'
import config from './commands/config'
import info from './commands/info'
import doctor from './commands/doctor'
import convert from './commands/convert'
import update from './commands/update'
import customCommand from './commands/customCommand'

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
        version: ['v']
      },
      boolean: ['version']
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
        case 'build':
          build(kernel, {
            platform: args.type,
            isWatch: !!args.watch,
            port: args.port,
            release: args.release,
            ui: args.ui,
            uiIndex: args.uiIndex,
            page: args.page,
            component: args.component,
            plugin: args.plugin
          })
          break
        case 'init':
          const projectName = _[1]
          init(kernel, {
            appPath: this.appPath,
            projectName,
            typescript: !!args.typescript,
            templateSource: args['template-source'],
            clone: !!args.clone,
            template: args.template,
            css: args.css
          })
          break
        case 'create':
          const type = _[1] || 'page'
          const name = _[2] || args.name
          create(kernel, {
            appPath: this.appPath,
            type,
            name,
            description: args.description
          })
          break
        case 'config':
          const cmd = _[1]
          const key = _[2]
          const value = _[3]
          config(kernel, {
            cmd,
            key,
            value,
            json: !!args.json
          })
          break
        case 'info':
          const rn = _[1]
          info(kernel, {
            appPath: this.appPath,
            rn
          })
          break
        case 'doctor':
          doctor(kernel, {
            appPath: this.appPath
          })
          break
        case 'convert':
          convert(kernel, {
            appPath: this.appPath
          })
          break
        case 'update':
          const updateType = _[1]
          const version = _[2]
          update(kernel, {
            appPath: this.appPath,
            updateType,
            version
          })
          break
        default:
          customCommand(command, kernel, args)
          break
      }
    }
  }
}
