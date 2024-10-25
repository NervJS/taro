import { execSync } from 'node:child_process'
import path from 'node:path'

import { chalk, fs } from '@tarojs/helper'
import { isFunction, isString, toDashed } from '@tarojs/shared'

import { addLeadingSlash } from '../utils'
import { componentConfig } from '../utils/component'

import type { ViteHarmonyCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption } from 'vite'
import type { TaroHarmonyPageMeta } from './template/page'

export default function (viteCompilerContext: ViteHarmonyCompilerContext): PluginOption {
  const { taroConfig } = viteCompilerContext
  return [{
    name: 'taro:vite-harmony-emit',
    async generateBundle (_outputOpts, bundle) {
      const compPathId = await this.resolve(taroConfig.taroComponentsPath)
      if (compPathId) {
        const id = compPathId.id
        const depsChunks = ['vendors.js', 'common.js']
        let isFound = false
        // eslint-disable-next-line no-inner-declarations
        function collectDeps (chunkName: string) {
          const chunk = bundle[chunkName]
          if (chunk?.type === 'chunk' && chunk.moduleIds.includes(id)) {
            const module = chunk.modules[id]
            module.renderedExports.forEach(item => componentConfig.includes.add(toDashed(item)))
            isFound = true
            return true
          }
        }
        depsChunks.some(collectDeps)
        if (!isFound) {
          for (const chunkName in bundle) {
            if (collectDeps(chunkName)) break
          }
        }
      }

      // Note: 组件编译模式不修改 Harmony 配置
      if (!taroConfig.isBuildNativeComp) {
        // Note: 修改 harmony Hap 的配置文件，注入路由配置
        viteCompilerContext.modifyHarmonyConfig(viteCompilerContext.app.config)
      }
    }
  }, {
    name: 'taro:vite-harmony-emit-post',
    enforce: 'post',
    async generateBundle (_outputOpts, bundle) {
      for (const fileName in bundle) {
        if (fileName.endsWith('.css')) {
          delete bundle[fileName]
        }
      }

      if (isFunction(taroConfig.modifyBuildAssets)) {
        const assets = {}
        for (const name in bundle) {
          const chunk = bundle[name]
          const source = chunk.type === 'asset' ? chunk.source : chunk.code
          assets[chunk.fileName] = {
            source: () => source
          }
        }
        const assetsProxy = new Proxy(assets, {
          set (target, p, newValue) {
            if (!isString(p)) return false

            target[p] = newValue
            const chunk = bundle[p]
            if (chunk.type === 'asset') {
              chunk.source = newValue.source()
            } else {
              chunk.code = newValue.source()
            }
            return true
          },
        })
        taroConfig.modifyBuildAssets(
          assetsProxy,
          {
            pages: viteCompilerContext.pages,
            filesConfig: viteCompilerContext.filesConfig,
            getConfigFilePath: viteCompilerContext.getConfigFilePath,
            options: {}
          }
        )
      }

      // TODO 收集运行时使用 Harmony 依赖
      const deps = {
        // Note: 目前开发者工具版本支持以下依赖
        // '@hmscore/hms-js-base': '^6.1.0-300',
        // '@hmscore/hms-jsb-account': '^1.0.300'
      }
      const pkg = viteCompilerContext.modifyHostPackage(deps)

      const { projectPath, hapName = 'entry', ohpm } = taroConfig
      const outputRoot = path.join(projectPath, hapName)
      if (taroConfig.isBuildNativeComp && typeof pkg?.main === 'string' && pkg.main) {
        const mainFile = path.join(outputRoot, pkg.main)
        // @ts-ignore
        const comps = viteCompilerContext.getComponents() || []

        const lines: string[] = []
        comps.forEach((comp: TaroHarmonyPageMeta) => {
          const key = Object.keys(taroConfig.router?.customRoutes || {}).find(e => {
            const name = comp.originName || comp.name
            return [name, addLeadingSlash(name)].includes(e)
          })

          if (key) {
            const alias = taroConfig.router?.customRoutes![key]
            if (alias instanceof Array) {
              alias.forEach(item => lines.push(`export * from './${path.posix.join('src/main', 'ets', item)}'`))
            } else if (typeof alias === 'string') {
              lines.push(`export * from './${path.posix.join('src/main', 'ets', alias)}'`)
            }
          } else {
            lines.push(`export * from './${path.posix.join('src/main', 'ets', comp.name)}'`)
          }
        })
        lines.push('')
        fs.writeFileSync(mainFile, lines.join('\n'))
      }
      let ohpmPath = ohpm
      let localOhpmPath = ''
      try {
        if (!ohpm) {
          localOhpmPath = execSync(`${process?.platform === 'win32' ? 'where' : 'which'} ohpm`).toString().replace(/\n/, '')
        }
      } catch (_) {
        localOhpmPath = ''
      }
      ohpmPath = ohpm || localOhpmPath || '~/Library/Huawei/ohpm/bin/ohpm'

      try {
        console.log(`\n\n开始 ${chalk.yellow('ohpm install')} 脚本执行...\n`) // eslint-disable-line no-console
        execSync(`${ohpmPath} install`, { cwd: outputRoot, stdio: 'inherit' })
        console.log(`执行 ${chalk.yellow('ohpm install')} 脚本成功。\n`) // eslint-disable-line no-console
      } catch (e) {
        console.error(`自动安装依赖失败，请手动执行 ${chalk.yellow('ohpm install')} 或在 DevEco Studio 中打开 oh-package.json5 并点击 ${chalk.yellow('Sync Now')} 按钮`)
      }
    }
  }]
}
