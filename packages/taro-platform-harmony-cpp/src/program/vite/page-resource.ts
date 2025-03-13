import path from 'node:path'

import { chalk, fs, NODE_MODULES } from '@tarojs/helper'
import { isObject } from '@tarojs/shared'

import { genRawFileName, getProjectId, RAWFILE_FOLDER, RAWFILE_NAME_PREFIX } from '../../utils'

import type { PluginContext } from 'rollup'
import type { PluginOption } from 'vite'
import type Harmony from '..'

export default function (this: Harmony): PluginOption {
  const that = this
  const { output } = this.config
  // eslint-disable-next-line eqeqeq
  const needCleanResources = output == undefined || output.clean == undefined || output.clean === true || isObject(output.clean)
  const projectId = getProjectId()
  const tmpDir = path.join(process.cwd(), NODE_MODULES, '.taro/tmp')
  if (needCleanResources) {
    fs.ensureDirSync(tmpDir)
    fs.emptyDirSync(tmpDir)
  }
  let finalOutDir = ''

  return {
    name: 'taro:rollup-page-resources',
    config: (config) => {
      const outDir = config.build?.outDir
      if (outDir && outDir.endsWith('ets')) {
        // 备份原始 outDir 下除了 ets、resources/rawfile 之外的文件
        finalOutDir = path.join(outDir, '..')
        config.build!.outDir = finalOutDir
      }
      return config
    },
    buildStart(this: PluginContext) {
      const pluginContext = this
      const { runnerUtils } = that.context

      const { getViteHarmonyCompilerContext } = runnerUtils
      const compiler = getViteHarmonyCompilerContext(pluginContext)!
      const taroConfig = compiler.taroConfig

      // Note: 组件编译模式不修改 Harmony 配置
      if (!taroConfig.isBuildNativeComp) {
        // Note: 修改 harmony Hap 的配置文件，注入路由配置
        compiler.modifyHarmonyConfig(compiler.app.config)
      }

      if (needCleanResources) {
        fs.copySync(finalOutDir, tmpDir, {
          filter: (src) => {
            const copyPath = path.relative(finalOutDir, src)
            return (
              !copyPath ||
              (!copyPath.startsWith('.') &&
                !copyPath.startsWith('ets') &&
                !copyPath.includes(`${RAWFILE_FOLDER}/${RAWFILE_NAME_PREFIX}`))
            )
          },
        })
        fs.emptyDirSync(finalOutDir)
        ;['uncaughtException', 'unhandledRejection', 'uncaughtExceptionMonitor'].forEach((event) => {
          process.on(event, (reason) => {
            console.error('捕获到未处理的错误:', reason)
          })
        })
        ;['EPIPE', 'SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) => {
          process.once(signal, () => {
            if (!fs.existsSync(path.join(finalOutDir, 'module.json5'))) {
              fs.copySync(tmpDir, finalOutDir)
              console.warn(`收到 ${chalk.yellow(signal)} 信号，已将临时文件夹拷贝至输出目录`)
              process.exit(0)
            }
          })
        })
      }
    },
    generateBundle(_, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.fileName.endsWith('.ets')) {
          chunk.fileName = `ets/${chunk.fileName}`
        } else {
          chunk.fileName = path.join(RAWFILE_FOLDER, genRawFileName(projectId), chunk.fileName)
        }
      }

      if (!needCleanResources) return
      fs.copySync(tmpDir, finalOutDir)
    },
  }
}
