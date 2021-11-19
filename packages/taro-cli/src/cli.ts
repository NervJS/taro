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
      const kernel = new Kernel({
        appPath: this.appPath,
        presets: [
          path.resolve(__dirname, '.', 'presets', 'index.js')
        ]
      })
      switch (command) {
        case 'build': {
          let plugin
          let platform = args.type
          const { publicPath, bundleOutput, sourcemapOutput, sourceMapUrl, sourcemapSourcesRoot, assetsDest } = args
          if (typeof args.plugin === 'string') {
            plugin = args.plugin
            platform = 'plugin'
          }
          customCommand('build', kernel, {
            _: args._,
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
          const projectName = _[1] || args.name
          init(kernel, {
            appPath: this.appPath,
            projectName,
            description: args.description,
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
