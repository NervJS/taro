import commonjs from '@rollup/plugin-commonjs'
import { fs } from '@tarojs/helper'
import { mergeWith } from 'lodash'

import apiLoader from './api-loader'
import { getLoaderMeta } from './loader-meta'

import type { PluginOption } from 'vite'
import type { Frameworks } from './index'

export function h5iVitePlugin (framework: Frameworks): PluginOption {
  return [
    injectLoaderMeta(framework),
    setTaroApi(),
    commonjs({
      dynamicRequireTargets: [
        // 包含要转换为动态import语句的模块名称的数组
        'node_modules/preact'
      ],
      // include: 'node_modules/@tarojs/plugin-framework-react/dist/runtime.js'
    })
  ]
}

function injectLoaderMeta (framework): PluginOption {
  function customizer (object = '', sources = '') {
    if ([object, sources].every(e => typeof e === 'string')) return object + sources
  }
  return {
    name: 'taro-react:loader-meta',
    async buildStart () {
      await this.load({ id: 'taro:compiler' })
      const info = this.getModuleInfo('taro:compiler')
      const compiler = info?.meta.compiler
      if (compiler) {
        compiler.loaderMeta = mergeWith(
          getLoaderMeta(framework), compiler.loaderMeta, customizer
        )
      }
    }
  }
}

function setTaroApi (): PluginOption {
  return {
    name: 'taro-react:process-import-taro',
    enforce: 'pre',
    config: () => ({
      optimizeDeps: {
        force: true,
        esbuildOptions: {
          plugins: [
            {
              name: 'taro:react-api',
              setup (build) {
                build.onLoad({ filter: /@tarojs[\\/]plugin-platform-h5[\\/]dist[\\/]runtime[\\/]apis[\\/]index/ }, async (args) => {
                  const input = await fs.readFile(args.path, 'utf8')
                  return {
                    contents: apiLoader(input + '\n' + 'const taro = Taro__default\n')
                  }
                })
              },
            }
          ]
        }
      },
    })
  }
}
