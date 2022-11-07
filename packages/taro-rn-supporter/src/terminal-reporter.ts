import * as MetroTerminalReporter from 'metro/src/lib/TerminalReporter'
import { Terminal } from 'metro-core'
import yargs from 'yargs'

import { entryFilePath } from './defaults'
import { previewDev, previewProd } from './preview'

export class TerminalReporter {
  _reporter: any
  _conditionalFileStore: any
  metroServerInstance: any
  _initialized: boolean
  _sourceRoot: string
  qr: boolean
  entry: string

  constructor (sourceRoot: string, conditionalFileStore: any, qr?: boolean, entry?: string) {
    this._reporter = new MetroTerminalReporter(new Terminal(process.stdout))
    this._conditionalFileStore = conditionalFileStore
    this._initialized = false
    this._sourceRoot = sourceRoot
    this.qr = qr ?? false
    this.entry = entry || 'app'
    const argvs = yargs(process.argv).argv
    if(this.qr && argvs._.includes('bundle')) {
      process.on('beforeExit', () => {
        previewProd({
          out: argvs.bundleOutput as string,
          platform: argvs.platform as string,
          assetsDest: argvs.assetsDest as string,
        })
      })
    }
  }

  async update (args) {
    // 当依赖图加载之后，检测app和页面配置文件的变化
    switch (args.type) {
      case 'initialize_started':
        this._reporter.terminal.log(`
  #####   ##   #####   ####     #####  ######   ##    ####  #####    #    #   ##   ##### # #    # ######
    #    #  #  #    # #    #    #    # #       #  #  #    #   #      ##   #  #  #    #   # #    # #
    #   #    # #    # #    #    #    # #####  #    # #        #      # #  # #    #   #   # #    # #####
    #   ###### #####  #    #    #####  #      ###### #        #      #  # # ######   #   # #    # #
    #   #    # #   #  #    #    #   #  #      #    # #    #   #      #   ## #    #   #   #  #  #  #
    #   #    # #    #  ####     #    # ###### #    #  ####    #      #    # #    #   #   #   ##   ######
`)
        break
      case 'initialize_done':
        process.stdin.on('keypress', (_key, data) => {
          const { name } = data
          if(name === 'q') {
            previewDev(args)
          }
        })
        console.log('To print qrcode press "q"')
        if (this.qr) {
          previewDev(args)
        }
        break
      case 'bundle_build_started':
        args.bundleDetails.entryFile = './index'
        this._reporter.update(args)
        break
      case 'bundle_build_done': {
        this._reporter.update(args)
        const realEntryPath = require.resolve(entryFilePath)
        if (this._initialized) {
          // 恢复入口页面的缓存
          this._reporter.ignoreEntryFileCache = false
          return
        }
        this._initialized = true
        if (!this.metroServerInstance) {
          return
        }
        const incrementalBundler = this.metroServerInstance.getBundler()
        const deltaBundler = incrementalBundler.getDeltaBundler()
        const bundler = incrementalBundler.getBundler()
        const findEntryGraphId = keys => {
          for (const k of keys) {
            // if (JSON.parse(k).entryFile === realEntryPath) {
            return k
            // }
          }
          return null
        }
        // 获取入口文件的graph
        const entryGraphId = findEntryGraphId(incrementalBundler._revisionsByGraphId.keys())
        const entryGraphVersion = await incrementalBundler.getRevisionByGraphId(entryGraphId)

        // 监听DeltaCalculator的change事件，把入口文件也加入到_modifiedFiles集合中
        bundler.getDependencyGraph().then(dependencyGraph => {
          dependencyGraph.getWatcher().on('change', ({ eventsQueue }) => {
            const changedFiles = eventsQueue.filter( item => {
              // APP配置文件变更和页面配置文件新增或删除时，重新编译入口文件
              if(item.filePath.includes(`${this.entry}.config`)) {
                return true
              }
              return item.type !=='change'
            }).map(item => item.filePath)
            // 如果配置文件修改之后，把入口文件添加到修改列表中
            const deltaCalculator = deltaBundler._deltaCalculators.get(entryGraphVersion.graph)
            const isConfigurationModified = keys => {
              for (const k of keys) {
                if (k.includes('.config') && k.includes(this._sourceRoot)) {
                  return true
                }
              }
              return false
            }
            if (isConfigurationModified(changedFiles)) {
              // 忽略入口文件的转译结果缓存
              this._conditionalFileStore.ignoreEntryFileCache = true
              deltaCalculator._modifiedFiles.add(realEntryPath)
              this._reporter.terminal.flush()
              console.log('\nConfiguration(s) are changed.')
            }
          })
        })
      }
        break
      default:
        this._reporter.update(args)
        break
    }
  }
}
