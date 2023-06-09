import { chalk, REG_VUE, VUE_EXT } from '@tarojs/helper'
import { DEFAULT_Components } from '@tarojs/runner-utils'
import { isString, isWebPlatform } from '@tarojs/shared'
import { capitalize, internalComponents, toCamelCase } from '@tarojs/shared/dist/template'
import { mergeWith } from 'lodash'

import { getLoaderMeta } from './loader-meta'

import type { IPluginContext } from '@tarojs/service'
import type { IComponentConfig } from '@tarojs/taro/types/compile/hooks'
import type { PluginOption } from 'vite'

export const CUSTOM_WRAPPER = 'custom-wrapper'


interface OnParseCreateElementArgs {
  nodeName: string
  componentConfig: IComponentConfig
}

export default (ctx: IPluginContext) => {
  const { framework } = ctx.initialConfig
  if (framework !== 'vue') return

  ctx.modifyWebpackChain(({ chain, data }) => {
    if (process.env.NODE_ENV !== 'production') {
      setAlias(chain)
    }
    customVueChain(chain, data)
    setLoader(chain)

    if (isWebPlatform()) {
      setStyleLoader(ctx, chain)
    }
  })

  ctx.modifyViteConfig(({ viteConfig, componentConfig }) => {
    viteConfig.plugins.push(require('@vitejs/plugin-vue2').default({
      template: getVueLoaderOptionByPlatform(isWebPlatform(), { componentConfig })
    }))
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
        '@tarojs/plugin-framework-vue2/dist/runtime'
      ]
      compiler.prebundle ||= {}
      const prebundleOptions = compiler.prebundle
      prebundleOptions.include ||= []
      prebundleOptions.include = prebundleOptions.include.concat(deps)
      prebundleOptions.exclude ||= []
    } else if (compiler.type === 'vite') {
      compiler.vitePlugins ||= []
      compiler.vitePlugins.push(viteCommonPlugin())
    }
  })

  ctx.onParseCreateElement(({ nodeName, componentConfig }: OnParseCreateElementArgs) => {
    if (capitalize(toCamelCase(nodeName)) in internalComponents) {
      componentConfig.includes.add(nodeName)
    }
  })
}

function getVueLoaderPath (): string {
  try {
    return require.resolve('vue-loader', {
      paths: [process.cwd()]
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(chalk.yellow('找不到 vue-loader，请先安装。'))
    process.exit(1)
  }
}

function getVueLoaderOptionByPlatform (isBuildH5: boolean, data?) {
  const h5Options = {
    transformAssetUrls: {
      video: ['src', 'poster'],
      'live-player': 'src',
      audio: 'src',
      source: 'src',
      image: 'src',
      'cover-image': 'src',
      'taro-video': ['src', 'poster'],
      'taro-live-player': 'src',
      'taro-audio': 'src',
      'taro-source': 'src',
      'taro-image': 'src',
      'taro-cover-image': 'src'
    },
    compilerOptions: {
      modules: [{
        preTransformNode (el) {
          if (DEFAULT_Components.has(el.tag)) {
            el.tag = 'taro-' + el.tag
          }
          return el
        }
      }]
    }
  }
  const miniOptions = {
    optimizeSSR: false,
    transformAssetUrls: {
      video: ['src', 'poster'],
      'live-player': 'src',
      audio: 'src',
      source: 'src',
      image: 'src',
      'cover-image': 'src'
    },
    compilerOptions: {
      whitespace: 'condense',
      modules: [{
        preTransformNode (el) {
          const nodeName = el.tag
          if (capitalize(toCamelCase(nodeName)) in internalComponents) {
            data.componentConfig.includes.add(nodeName)
          }

          if (nodeName === CUSTOM_WRAPPER) {
            data.componentConfig.thirdPartyComponents.set(CUSTOM_WRAPPER, new Set())
          }

          const usingComponent = data.componentConfig.thirdPartyComponents.get(nodeName)
          if (usingComponent != null) {
            el.attrsList
              .filter(a => !a.dynamic)
              .forEach(a => usingComponent.add(a.name.startsWith(':') ? a.name.slice(1) : a.name))
          }

          return el
        }
      }],
      mustUseProp: function () {
        return false
      }
    }
  }
  return isBuildH5 ? h5Options : miniOptions
}

function customVueChain (chain, data) {
  const vueLoaderPath = getVueLoaderPath()

  // plugin
  const { VueLoaderPlugin } = require(vueLoaderPath)
  chain
    .plugin('vueLoaderPlugin')
    .use(VueLoaderPlugin)

  // loader
  const vueLoaderOption = getVueLoaderOptionByPlatform(isWebPlatform(), data)

  chain.module
    .rule('vue')
    .test(REG_VUE)
    .use('vueLoader')
    .loader(vueLoaderPath)
    .options(vueLoaderOption)
}

function setStyleLoader (ctx: IPluginContext, chain) {
  const config = ctx.initialConfig.h5 || {}

  const { styleLoaderOption = {} } = config
  chain.module
    .rule('customStyle')
    .merge({
      use: [{
        loader: 'style-loader',
        options: styleLoaderOption
      }]
    })
}

function setLoader (chain) {
  function customizer (object = '', sources = '') {
    if ([object, sources].every(e => typeof e === 'string')) return object + sources
  }
  if (isWebPlatform()) {
    chain.plugin('mainPlugin')
      .tap(args => {
        args[0].loaderMeta = mergeWith(
          getLoaderMeta(), args[0].loaderMeta, customizer
        )
        return args
      })
  } else {
    chain.plugin('miniPlugin')
      .tap(args => {
        args[0].loaderMeta = getLoaderMeta()
        return args
      })
  }
}

function setAlias (chain) {
  // 避免 npm link 时，taro composition apis 使用的 vue 和项目使用的 vue 实例不一致。
  chain.resolve.alias
    .set('vue', require.resolve('vue'))
}

function viteCommonPlugin (): PluginOption {
  let compiler
  return {
    name: 'taro-vue2:common',
    config: () => ({
      resolve: {
        dedupe: process.env.NODE_ENV !== 'production' ? ['vue'] : []
      }
    }),
    buildStart () {
      const info = this.getModuleInfo('taro:compiler')
      compiler = info?.meta.compiler
      if (compiler) {
        compiler.loaderMeta = getLoaderMeta()
      }
    },
  }
}
