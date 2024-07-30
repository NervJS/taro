import { fs, REG_TARO_H5, VUE_EXT } from '@tarojs/helper'
import { isString } from '@tarojs/shared'
import { capitalize, internalComponents, toCamelCase } from '@tarojs/shared/dist/template'

import { h5VitePlugin } from './vite.h5'
import { harmonyVitePlugin } from './vite.harmony'
import { miniVitePlugin } from './vite.mini'
import { modifyH5WebpackChain } from './webpack.h5'
import { modifyHarmonyWebpackChain } from './webpack.harmony'
import { modifyMiniWebpackChain } from './webpack.mini'

import type { IPluginContext } from '@tarojs/service'
import type { IComponentConfig } from '@tarojs/taro/types/compile/hooks'
import type { PluginOption } from 'vite'

type CompilerOptions = {
  isCustomElement: (tag: string) => boolean
  whitespace: 'condense' | 'preserve'
  delimiters: string[]
  comments: boolean
  nodeTransforms: ((...args: any) => void)[]
}

interface OnParseCreateElementArgs {
  nodeName: string
  componentConfig: IComponentConfig
}

export interface IConfig {
  mini?: {
    compilerOptions: CompilerOptions
  }
  harmony?: {
    compilerOptions: CompilerOptions
  }
  vueLoaderOption?: {
    compilerOptions: CompilerOptions
    [key: string]: any
  }
}

export default (ctx: IPluginContext, config: IConfig = {}) => {
  const { framework } = ctx.initialConfig
  if (framework !== 'vue3') return

  ctx.modifyWebpackChain(({ chain, data }) => {
    // 通用
    if (process.env.NODE_ENV !== 'production') {
      setAlias(chain)
    }
    setDefinePlugin(chain)

    if (process.env.TARO_PLATFORM === 'web') {
      // H5
      modifyH5WebpackChain(ctx, chain, config)
    } else if (process.env.TARO_PLATFORM === 'harmony' || process.env.TARO_ENV === 'harmony') {
      // 鸿蒙
      modifyHarmonyWebpackChain(ctx, chain, data, config)
    } else {
      // 小程序
      modifyMiniWebpackChain(ctx, chain, data, config)
    }
  })

  ctx.modifyViteConfig(({ viteConfig, data }) => {
    viteConfig.plugins.push(viteCommonPlugin())
    viteConfig.plugins.push(require('@vitejs/plugin-vue-jsx').default())
    if (process.env.TARO_PLATFORM === 'web') {
      // H5
      viteConfig.plugins.push(h5VitePlugin(ctx, config))
    } else if (process.env.TARO_PLATFORM === 'harmony' || process.env.TARO_ENV === 'harmony') {
      // 鸿蒙
      viteConfig.plugins.push(harmonyVitePlugin(ctx, data?.componentConfig, config))
    } else {
      // 小程序
      viteConfig.plugins.push(miniVitePlugin(ctx, data?.componentConfig, config))
    }
  })

  ctx.modifyRunnerOpts(({ opts }) => {
    opts.frameworkExts = VUE_EXT

    if (!opts?.compiler) return

    if (isString(opts.compiler)) {
      opts.compiler = {
        type: opts.compiler,
      }
    }

    const { compiler } = opts
    if (compiler.type === 'webpack5') {
      // 提供给 webpack5 依赖预编译收集器的第三方依赖
      const deps = ['vue', '@tarojs/plugin-framework-vue3/dist/runtime']
      compiler.prebundle ||= {}
      const prebundleOptions = compiler.prebundle
      prebundleOptions.include ||= []
      prebundleOptions.include = prebundleOptions.include.concat(deps)

      const taroVue3Plugin = {
        name: 'taroVue3Plugin',
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
      esbuildConfig.plugins.push(taroVue3Plugin)
    }
  })

  ctx.onParseCreateElement(({ nodeName, componentConfig }: OnParseCreateElementArgs) => {
    if (capitalize(toCamelCase(nodeName)) in internalComponents) {
      componentConfig.includes.add(nodeName)
    }
  })
}

function setAlias(chain) {
  // 避免 npm link 时，taro composition apis 使用的 vue 和项目使用的 vue 实例不一致。
  chain.resolve.alias.set('vue', require.resolve('vue'))
}

function setDefinePlugin(chain) {
  chain.plugin('definePlugin').tap((args) => {
    const config = args[0]
    config.__VUE_OPTIONS_API__ = JSON.stringify(true)
    config.__VUE_PROD_DEVTOOLS__ = JSON.stringify(false)
    return args
  })
}

function viteCommonPlugin(): PluginOption {
  return {
    name: 'taro-vue3:common',
    config: () => ({
      define: {
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
      },
      resolve: {
        dedupe: ['vue'],
      },
      build: {
        sourcemap: false, // https://github.com/vitejs/vite-plugin-vue/issues/35
      },
    }),
  }
}
