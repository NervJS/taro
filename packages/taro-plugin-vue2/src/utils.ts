import { chalk } from '@tarojs/helper'
import { DEFAULT_Components } from '@tarojs/runner-utils'
import { capitalize, internalComponents, toCamelCase } from '@tarojs/shared'

export const CUSTOM_WRAPPER = 'custom-wrapper'

export function getVueLoaderPath (): string {
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

export function getH5VueLoaderOptions() {
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
  return h5Options
}

export function getMiniVueLoaderOptions(componentConfig) {
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
      }],
      mustUseProp: function () {
        return false
      }
    }
  }
  return miniOptions
}