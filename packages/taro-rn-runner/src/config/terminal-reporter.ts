import { Terminal } from 'metro-core'
import * as MetroTerminalReporter from 'metro/src/lib/TerminalReporter'
import * as ModuleResolution from 'metro/src/node-haste/DependencyGraph/ModuleResolution'

export class TerminalReporter {
  _reporter: any
  _conditionalFileStore: any
  metroServerInstance: any
  _initialized: boolean
  _entry: string

  constructor (entry: string, conditionalFileStore: any, metroServerInstance?: any) {
    this._reporter = new MetroTerminalReporter(new Terminal(process.stdout))
    this._conditionalFileStore = conditionalFileStore
    this.metroServerInstance = metroServerInstance
    this._initialized = false
    this._entry = entry
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
      case 'bundle_build_started':
        args.bundleDetails.entryFile = './index'
        this._reporter.update(args)
        break
      case 'bundle_build_done': {
        this._reporter.update(args)
        const realEntryPath = ModuleResolution.ModuleResolver.EMPTY_MODULE
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
            if (JSON.parse(k).entryFile === realEntryPath) {
              return k
            }
          }
          return null
        }
        // 获取入口文件的graph
        const entryGraphId = findEntryGraphId(incrementalBundler._revisionsByGraphId.keys())
        const entryGraphVersion = await incrementalBundler.getRevisionByGraphId(entryGraphId)

        // 监听DeltaCalculator的change事件，把入口文件也加入到_modifiedFiles集合中
        bundler.getDependencyGraph().then(dependencyGraph => {
          dependencyGraph.getWatcher().on('change', ({ eventsQueue }) => {
            const changedFiles = eventsQueue.map(item => item.filePath)
            // 如果配置文件修改之后，把入口文件添加到修改列表中
            const deltaCalculator = deltaBundler._deltaCalculators.get(entryGraphVersion.graph)
            const isConfigurationModified = keys => {
              for (const k of keys) {
                if (k.endsWith('.config')) {
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
