import * as TerminalReporter from 'metro/src/lib/TerminalReporter'
import * as readline from 'readline'

import { entryFilePath } from './defaults'
import { previewDev } from './preview'
import { shareObject } from './Support'

import type { TerminalReportableEvent } from 'metro/src/lib/TerminalReporter'

// 将 stdin 设置为 raw 模式来监听按键事件
readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)
process.stdin.on('keypress', (_key, data) => {
  const { name } = data
  if (name === 'q') {
    previewDev({
      port: shareObject.port || 8081,
    })
  }
})

// @ts-ignore
export default class TaroTerminalReporter extends TerminalReporter {
  _initialized: boolean
  constructor (terminal: any) {
    super(terminal)
    this._initialized = false
  }

  async update (event: TerminalReportableEvent) {
    // 当依赖图加载之后，检测app和页面配置文件的变化
    switch (event.type) {
      case 'initialize_started':
        console.log('To print qrcode press "q"')
        if (shareObject.qr) {
          previewDev(event)
        }
        break
      case 'bundle_build_done': {
        super.update(event)
        const realEntryPath = require.resolve(entryFilePath)
        if (this._initialized) {
          // 恢复入口页面的缓存
          shareObject.cacheStore.ignoreEntryFileCache = false
          return
        }
        this._initialized = true
        if (!shareObject.metroServerInstance) {
          return
        }
        const incrementalBundler = shareObject.metroServerInstance.getBundler()
        const deltaBundler = incrementalBundler.getDeltaBundler()
        const bundler = incrementalBundler.getBundler()
        const findEntryGraphId = keys => {
          for (const k of keys) {
            return k
          }
          return null
        }
        // 获取入口文件的graph
        const entryGraphId = findEntryGraphId(incrementalBundler._revisionsByGraphId.keys())
        const entryGraphVersion = await incrementalBundler.getRevisionByGraphId(entryGraphId)

        // 监听DeltaCalculator的change事件，把入口文件也加入到_modifiedFiles集合中
        bundler.getDependencyGraph().then(dependencyGraph => {
          dependencyGraph.getWatcher().on('change', ({ eventsQueue }) => {
            const changedFiles = eventsQueue.filter(item => {
              // APP配置文件变更和页面配置文件新增或删除时，重新编译入口文件
              if (item.filePath.includes(`${shareObject.entry}.config`)) {
                return true
              }
              return item.type !== 'change'
            }).map(item => item.filePath)
            // 如果配置文件修改之后，把入口文件添加到修改列表中
            const deltaCalculator = deltaBundler._deltaCalculators.get(entryGraphVersion.graph)
            const isConfigurationModified = keys => {
              for (const k of keys) {
                if (k.includes('.config') && k.includes(shareObject.sourceRoot)) {
                  return true
                }
              }
              return false
            }
            if (isConfigurationModified(changedFiles)) {
              // 忽略入口文件的转译结果缓存
              shareObject.cacheStore.ignoreEntryFileCache = true
              deltaCalculator._modifiedFiles.add(realEntryPath)
              for (const value of deltaCalculator._modifiedFiles) {
                console.log(1, value)
              }
              // @ts-ignore
              this.terminal.flush()
              console.log('\nConfiguration(s) are changed.')
            }
          })
        })
      }
        break
      default:
        super.update(event)
        break
    }
  }
}
