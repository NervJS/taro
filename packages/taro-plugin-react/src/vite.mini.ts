import { fs } from '@tarojs/helper'

import { getLoaderMeta } from './loader-meta'

import type { IPluginContext } from '@tarojs/service'
import type { PluginOption } from 'vite'
import type { Frameworks } from './index'

export function miniVitePlugin (ctx: IPluginContext, framework: Frameworks): PluginOption {
  return [
    injectLoaderMeta(framework),
    aliasPlugin(ctx, framework),
  ]
}

function injectLoaderMeta (framework: Frameworks): PluginOption {
  return {
    name: 'taro-react:loader-meta',
    buildStart () {
      const info = this.getModuleInfo('taro:compiler')
      const compiler = info?.meta.compiler
      if (compiler) {
        compiler.loaderMeta = getLoaderMeta(framework)
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
          { find: /react-dom$/, replacement: '@tarojs/react' }
        ]

        const isProd = config.mode === 'production'
        // TODO：harmony 目前会导致部分包用 production 版本，部分用 development 版本，导致许多 api 报错
        const isHarmony = ctx.runOpts.options.platform === 'harmony'
        if (!isProd && ctx.initialConfig.mini?.debugReact !== true && !isHarmony) {
          // 不是生产环境，且没有设置 debugReact，则使用压缩版本的 react 依赖，减少体积
          alias.push({ find: /react-reconciler$/, replacement: 'react-reconciler/cjs/react-reconciler.production.min.js' })
          alias.push({ find: /react$/, replacement: 'react/cjs/react.production.min.js' })
          alias.push({ find: /scheduler$/, replacement: 'scheduler/cjs/scheduler.production.min.js' })
          alias.push({ find: /react\/jsx-runtime$/, replacement: 'react/cjs/react-jsx-runtime.production.min.js' })

          // 在React18中，使用了exports字段约定了模块暴露路径，其中并未暴露 ./cjs/ 。这将使上面的alias在编译时报错。相当的tricky。
          // Why writeJson？ prebundle will load package.json via readFile to check exports property.
          const reactPkgPath = require.resolve('react/package.json', { paths: [process.cwd()] })
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
