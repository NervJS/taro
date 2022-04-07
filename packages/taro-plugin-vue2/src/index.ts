import { REG_VUE, chalk } from '@tarojs/helper'
import { DEFAULT_Components } from '@tarojs/runner-utils'
import { internalComponents, toCamelCase, capitalize } from '@tarojs/shared/dist/template'
import { getLoaderMeta } from './loader-meta'

import type { IPluginContext } from '@tarojs/service'

const CUSTOM_WRAPPER = 'custom-wrapper'
let isBuildH5

export default (ctx: IPluginContext) => {
  const { framework } = ctx.initialConfig
  if (framework !== 'vue') return

  isBuildH5 = process.env.TARO_ENV === 'h5'

  ctx.modifyWebpackChain(({ chain, data }) => {
    customVueChain(chain, data)
    setLoader(chain)

    if (isBuildH5) {
      setStyleLoader(ctx, chain)
    }
  })

  ctx.modifyRunnerOpts(({ opts }) => {
    if (!opts?.compiler) return

    const { compiler } = opts
    const WEBPACK5 = 'webpack5'
    // 提供给 webpack5 依赖预编译收集器的第三方依赖
    const deps = ['@tarojs/plugin-framework-vue2/dist/runtime']
    if (compiler === WEBPACK5) {
      opts.compiler = {
        type: WEBPACK5,
        prebundle: {
          include: deps
        }
      }
    } else if (typeof compiler === 'object' && compiler.type === WEBPACK5) {
      compiler.prebundle ||= {}
      const prebundleOptions = compiler.prebundle
      prebundleOptions.include ||= []
      prebundleOptions.include = prebundleOptions.include.concat(deps)
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

function customVueChain (chain, data) {
  const vueLoaderPath = getVueLoaderPath()

  // plugin
  const { VueLoaderPlugin } = require(vueLoaderPath)
  chain
    .plugin('vueLoaderPlugin')
    .use(VueLoaderPlugin)

  // loader
  let vueLoaderOption

  if (isBuildH5) {
    // H5
    vueLoaderOption = {
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
  } else {
    // 小程序
    vueLoaderOption = {
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
  }

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
  if (isBuildH5) {
    chain.plugin('mainPlugin')
      .tap(args => {
        args[0].loaderMeta = getLoaderMeta()
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
