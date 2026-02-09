import { defaultMainFields, fs, resolveSync } from '@tarojs/helper'

import { getLoaderMeta } from './loader-meta'

import type { IPluginContext } from '@tarojs/service'
import type { PluginOption } from 'vite'
import type { Frameworks } from './index'

export function harmonyVitePlugin (ctx: IPluginContext, framework: Frameworks): PluginOption {
  return [
    injectLoaderMeta(ctx, framework),
    aliasPlugin(ctx, framework),
  ]
}

function injectLoaderMeta (ctx: IPluginContext, framework: Frameworks): PluginOption {
  return {
    name: 'taro-react:loader-meta',
    async buildStart () {
      const { runnerUtils } = ctx
      const { getViteHarmonyCompilerContext } = runnerUtils
      const viteCompilerContext = await getViteHarmonyCompilerContext(this)
      if (viteCompilerContext) {
        viteCompilerContext.loaderMeta ||= {}
        Object.assign(viteCompilerContext.loaderMeta, getLoaderMeta(framework))
      }
    }
  }
}

function aliasPlugin (ctx: IPluginContext, framework: Frameworks): PluginOption {
  if (framework === 'react') {
    return {
      name: 'taro-react:alias',
      config (config) {
        const alias: ({ find: string | RegExp, replacement: string })[] = [
          { find: /react-dom$/, replacement: '@tarojs/react' },
          { find: /react-dom\/client$/, replacement: '@tarojs/react' },
        ]

        const mainFields = ['unpkg', ...defaultMainFields]
        const resolveOptions = {
          basedir: process.cwd(),
          mainFields,
        }
        const isProd = config.mode === 'production'
        // TODO：harmony 目前会导致部分包用 production 版本，部分用 development 版本，导致许多 api 报错
        const isHarmony = ctx.runOpts.options.platform === 'harmony'
        if (!isProd && ctx.initialConfig.harmony?.debugReact !== true && !isHarmony) {
          // 在React18中，使用了exports字段约定了模块暴露路径，其中并未暴露 ./cjs/ 。这将使上面的alias在编译时报错。相当的tricky。
          // Why writeJson？ prebundle will load package.json via readFile to check exports property.
          const reactPkgPath = resolveSync('react/package.json', resolveOptions)
          if (reactPkgPath) {
            const reactPkg = require('react/package.json')
            const reactVersion = (reactPkg.version || '')
            if ((/^[~^]?18/).test(reactVersion) && reactPkg.exports) {
              reactPkg.exports = Object.assign(reactPkg.exports, {
                './cjs/': './cjs/'
              })
              fs.writeJsonSync(reactPkgPath, reactPkg, { spaces: 2 })
            }
          }
        }

        return {
          resolve: {
            alias
          }
        }
      }
    }
  }
  return []
}
