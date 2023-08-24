import { esbuild, fs, REG_TARO_H5 } from '@tarojs/helper'
import { isString, isWebPlatform } from '@tarojs/shared'

import { h5iVitePlugin } from './vite.h5'
import { miniVitePlugin } from './vite.mini'
import { modifyH5WebpackChain } from './webpack.h5'
import { modifyMiniWebpackChain } from './webpack.mini'

import type { IPluginContext } from '@tarojs/service'
import type { IProjectConfig } from '@tarojs/taro/types/compile'
import type { PluginOption } from 'vite'

export type Frameworks = 'react' | 'preact' | 'nerv'

export function isReactLike(framework: IProjectConfig['framework'] = 'react'): framework is Frameworks {
  return ['react', 'preact', 'nerv'].includes(framework)
}

export default (ctx: IPluginContext) => {
  const { framework = 'react' } = ctx.initialConfig

  if (!isReactLike(framework)) return

  ctx.modifyWebpackChain(({ chain }) => {
    // 通用
    setAlias(framework, chain)
    chain.plugin('definePlugin').tap((args) => {
      const config = args[0]
      config.__TARO_FRAMEWORK__ = `"${framework}"`
      return args
    })

    if (isWebPlatform()) {
      // H5
      modifyH5WebpackChain(ctx, framework, chain)
    } else {
      // 小程序
      modifyMiniWebpackChain(ctx, framework, chain)
    }
  })

  ctx.modifyRunnerOpts(({ opts }) => {
    if (!opts?.compiler) return

    if (isString(opts.compiler)) {
      opts.compiler = {
        type: opts.compiler,
      }
    }

    const { compiler } = opts
    if (compiler.type === 'webpack5') {
      // 提供给 webpack5 依赖预编译收集器的第三方依赖
      const deps = ['react', 'react-dom', 'react/jsx-runtime', '@tarojs/plugin-framework-react/dist/runtime']
      compiler.prebundle ||= {}
      const prebundleOptions = compiler.prebundle
      prebundleOptions.include ||= []
      prebundleOptions.include = prebundleOptions.include.concat(deps)
      prebundleOptions.exclude ||= []
      prebundleOptions.exclude.push(/mobx/) // 依赖会对 webpack 修改，默认排除
      if (prebundleOptions.enable === false) return

      const taroReactPlugin: esbuild.Plugin = {
        name: 'taroReactPlugin',
        setup(build) {
          build.onLoad({ filter: REG_TARO_H5 }, ({ path }) => {
            const content = fs.readFileSync(path).toString()
            return {
              contents: require('./api-loader')(content),
            }
          })
        },
      }

      prebundleOptions.esbuild ||= {}
      const esbuildConfig = prebundleOptions.esbuild
      esbuildConfig.plugins ||= []
      esbuildConfig.plugins.push(taroReactPlugin)
    } else if (compiler.type === 'vite') {
      compiler.vitePlugins ||= []
      compiler.vitePlugins.push(viteCommonPlugin(framework))
      compiler.vitePlugins.push(VitePresetPlugin(framework))
      if (isWebPlatform()) {
        // H5
        compiler.vitePlugins.push(h5iVitePlugin(framework))
      } else {
        // 小程序
        compiler.vitePlugins.push(miniVitePlugin(ctx, framework))
      }
    }
  })
}

function setAlias(framework: Frameworks, chain) {
  const alias = chain.resolve.alias

  switch (framework) {
    case 'preact':
      alias.set('react', 'preact/compat')
      alias.set('react-dom/test-utils', 'preact/test-utils')
      alias.set('react-dom', 'preact/compat')
      alias.set('react/jsx-runtime', 'preact/jsx-runtime')
      break
    case 'nerv':
      alias.set('react$', 'nervjs')
      alias.set('react-dom$', 'nervjs')
      break
  }
}

function VitePresetPlugin (framework: Frameworks): PluginOption {
  return framework === 'preact'
    ? require('@preact/preset-vite').preact()
    : require('@vitejs/plugin-react').default()
}

function viteCommonPlugin(framework: Frameworks): PluginOption {
  return {
    name: 'taro-react:common',
    config() {
      const alias =
        framework === 'preact'
          ? [
            { find: 'react', replacement: 'preact/compat' },
            { find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
            { find: 'react-dom', replacement: 'preact/compat' },
            { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' },
          ]
          : []

      return {
        optimizeDeps:{
          esbuildOptions:{
            define: {
              __TARO_FRAMEWORK__: `"${framework}"`
            }
          }
        },
        define: {
          __TARO_FRAMEWORK__: `"${framework}"`,
        },
        resolve: {
          alias,
        },
      }
    },
  }
}
