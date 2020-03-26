import * as minimist from 'minimist'

import build from './build'

export default class CLI {
  appPath: string
  constructor (appPath) {
    this.appPath = appPath || process.cwd()
  }

  run () {
    this.parseArgs()
  }

  parseArgs () {
    // const args = arg({
    //   // Common Options Types
    //   '--help': Boolean,
    //   '--version': Boolean,

    //   // Create Options Types
    //   '--name': String,
    //   '--description': String,

    //   // Init Options Types
    //   '--typescript': Boolean,
    //   '--no-typescript': Boolean,
    //   '--template-source': String,
    //   '--clone': Boolean,
    //   '--template': String,
    //   '--css': String,

    //   // Build Options Types
    //   '--type': String,
    //   '--watch': Boolean,
    //   '--page': String,
    //   '--component': String,
    //   '--ui': Boolean,
    //   '--ui-index': String,
    //   '--plugin': String,
    //   '--port': Number,
    //   '--release': Boolean,

    //   // Config Options Types
    //   '--json': Boolean,

    //   // Options Alias
    //   '-h': '--help',
    //   '-v': '--version',
    //   '-w': '--watch'
    // }, {
    //   argv: process.argv.slice(2)
    // })
    const args = minimist(process.argv.slice(2), {
      alias: {
        version: ['v']
      },
      boolean: ['version']
    })
    const _ = args._
    const command = _[0]
    console.log(args)
    if (command) {
      switch (command) {
        case 'build':
          if (typeof args.type !== 'string') {
            return
          }
          build({
            platform: args.type,
            appPath: this.appPath,
            isWatch: !!args.watch,
            port: args.port,
            release: args.release
          })
          break
        default:
          break
      }
    }
  }
}
