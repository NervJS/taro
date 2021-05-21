import { REG_VUE, chalk } from '@tarojs/helper'
import { toCamelCase, internalComponents, capitalize } from '@tarojs/shared'
import { componentConfig } from '../template/component'

const CUSTOM_WRAPPER = 'custom-wrapper'

export function customVueChain (chain) {
  let vueLoaderPath: string
  try {
    vueLoaderPath = require.resolve('vue-loader', {
      paths: [process.cwd()]
    })
  } catch (error) {
    console.log(chalk.yellow('找不到 vue-loader，请先安装。'))
    process.exit(1)
  }

  const { VueLoaderPlugin } = require(vueLoaderPath)

  chain
    .plugin('vueLoaderPlugin')
    .use(VueLoaderPlugin)

  chain.module
    .rule('vue')
    .test(REG_VUE)
    .use('vueLoader')
    .loader(vueLoaderPath)
    .options({
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
              componentConfig.includes.add(nodeName)
            }

            if (nodeName === CUSTOM_WRAPPER) {
              componentConfig.thirdPartyComponents.set(CUSTOM_WRAPPER, new Set())
            }

            const usingComponent = componentConfig.thirdPartyComponents.get(nodeName)
            if (usingComponent != null) {
              el.attrsList
                .filter(a => !a.dynamic)
                .forEach(a => usingComponent.add(a.name.startsWith(':') ? a.name.slice(1) : a.name))
            }

            return el
          }
        }]
      }
    })
}
