import { fs, VUE_EXT } from '@tarojs/helper'
import { isString, isWebPlatform } from '@tarojs/shared'
import { capitalize, internalComponents, toCamelCase } from '@tarojs/shared/dist/template'

import { modifyH5WebpackChain } from './webpack.h5'
import { modifyMiniWebpackChain } from './webpack.mini'

import type { IPluginContext } from '@tarojs/service'
import type { IComponentConfig } from '@tarojs/taro/types/compile/hooks'

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

    if (isWebPlatform()) {
      // H5
      modifyH5WebpackChain(ctx, chain, config)
    } else {
      // 小程序
      modifyMiniWebpackChain(ctx, chain, data, config)
    }
  })

  ctx.modifyRunnerOpts(({ opts }) => {
    opts.frameworkExts = VUE_EXT

    if (!opts?.compiler) return

    if (isString(opts.compiler)) {
      opts.compiler = {
        type: opts.compiler
      }
    }

    const { compiler } = opts
    if (compiler.type === 'webpack5') {
      // 提供给 webpack5 依赖预编译收集器的第三方依赖
      const deps = [
        'vue',
        '@tarojs/plugin-framework-vue3/dist/runtime'
      ]
      compiler.prebundle ||= {}
      const prebundleOptions = compiler.prebundle
      prebundleOptions.include ||= []
      prebundleOptions.include = prebundleOptions.include.concat(deps)

      const taroVue3Plugin = {
        name: 'taroVue3Plugin',
        setup (build) {
          build.onLoad({ filter: /taro-h5[\\/]dist[\\/]api[\\/]taro/ }, ({ path }) => {
            const content = fs.readFileSync(path).toString()
            return {
              contents: require('./api-loader')(content)
            }
          })
        }
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

function setAlias (chain) {
  // 避免 npm link 时，taro composition apis 使用的 vue 和项目使用的 vue 实例不一致。
  chain.resolve.alias
    .set('vue', require.resolve('vue'))
}

function setDefinePlugin (chain) {
  chain
    .plugin('definePlugin')
    .tap(args => {
      const config = args[0]
      config.__VUE_OPTIONS_API__ = JSON.stringify(true)
      config.__VUE_PROD_DEVTOOLS__ = JSON.stringify(false)
      return args
    })
}
