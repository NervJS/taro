import path from 'node:path'

import { defaultMainFields, fs, resolveSync } from '@tarojs/helper'

import { getLoaderMeta } from './loader-meta'

import type { IPluginContext } from '@tarojs/service'
import type { Frameworks } from './index'

export function modifyMiniWebpackChain (ctx: IPluginContext, framework: Frameworks, chain) {
  setAlias(ctx, framework, chain)
  setLoader(framework, chain)
}

function setAlias (ctx: IPluginContext, framework: Frameworks, chain) {
  const config = ctx.initialConfig
  const alias = chain.resolve.alias

  const mainFields = ['unpkg', ...defaultMainFields]
  const resolveOptions = {
    basedir: process.cwd(),
    mainFields,
  }
  if (framework === 'react') {
    alias.set('react-dom$', '@tarojs/react')
    alias.set('react-dom/client$', '@tarojs/react')
    const webpackConfig = chain.toConfig()
    const isProd = webpackConfig.mode === 'production'
    if (!isProd && config.mini?.debugReact !== true) {
      // 不是生产环境，且没有设置 debugReact，则使用压缩版本的 react 依赖，减少体积
      // 兼容pnpm workspace
      const reactModulePath = resolveSync('react', resolveOptions)!
      const newFilePath = path.join(path.dirname(reactModulePath), 'cjs', 'react.production.min.js')

      alias.set('react-reconciler$', 'react-reconciler/cjs/react-reconciler.production.min.js')
      alias.set(/^(?!.*mobx-react$).*react$/, newFilePath)
      alias.set('react/jsx-runtime$', 'react/cjs/react-jsx-runtime.production.min.js')

      // 在React18中，使用了exports字段约定了模块暴露路径，其中并未暴露 ./cjs/ 。这将使上面的alias在编译时报错。相当的tricky。
      // Why writeJson？ prebundle will load package.json via readFile to check exports property.
      const reactPkgPath = resolveSync('react/package.json', resolveOptions)
      if (reactPkgPath) {
        const reactPkg = require('react/package.json')
        const reactVersion = reactPkg.version || ''
        if (/^[~^]?18/.test(reactVersion) && reactPkg.exports) {
          reactPkg.exports = Object.assign(reactPkg.exports, {
            './cjs/': './cjs/',
          })
          fs.writeJsonSync(reactPkgPath, reactPkg, { spaces: 2 })
        }
      }
    }
  }
}

function setLoader (framework: Frameworks, chain) {
  chain.plugin('miniPlugin').tap((args) => {
    args[0].loaderMeta ||= {}
    Object.assign(args[0].loaderMeta, getLoaderMeta(framework))
    return args
  })
}
