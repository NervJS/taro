import { fs, REG_TARO_H5_RUNTIME_API } from '@tarojs/helper'
import { mergeWith } from 'lodash'

import apiLoader from './api-loader'
import { getLoaderMeta } from './loader-meta'

import type { IPluginContext } from '@tarojs/service'
import type { PluginOption } from 'vite'
import type { Frameworks } from './index'

export function h5iVitePlugin (ctx: IPluginContext, framework: Frameworks): PluginOption {
  return [
    injectLoaderMeta(ctx, framework),
    setTaroApi(),
    esbuildExclude(framework)
  ]
}

function injectLoaderMeta (ctx: IPluginContext, framework: Frameworks): PluginOption {
  function customizer (object = '', sources = '') {
    if ([object, sources].every(e => typeof e === 'string')) return object + sources
  }
  const { runnerUtils } = ctx
  const { getViteH5Compiler } = runnerUtils
  return {
    name: 'taro-react:loader-meta',
    async buildStart () {
      const compiler = await getViteH5Compiler(this)
      if (compiler) {
        compiler.loaderMeta = mergeWith(
          getLoaderMeta(framework), compiler.loaderMeta, customizer
        )
      }
    }
  }
}

function setTaroApi (): PluginOption {
  // dev 环境通过 esbuild 来做； pro 环境通过 rollup load 钩子来做；因为生产环境不会走 esbuild
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
                build.onLoad({ filter: REG_TARO_H5_RUNTIME_API }, async (args) => {
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
    }),
    async load (id) {
      if (process.env.NODE_ENV === 'production' && REG_TARO_H5_RUNTIME_API.test(id)) {
        const input = await fs.readFile(id, 'utf8')
        return apiLoader(input + '\n' + 'const taro = Taro__default\n')
      }
    }
  }
}

// todo 后面看看能否把 preact 改为虚拟模块
function esbuildExclude (framework: Frameworks): PluginOption {
  if (framework !== 'preact') return null
  return {
    name: 'taro-react:esvuild-exclude',
    enforce: 'pre',
    config: ()=>({
      optimizeDeps: {
        exclude: ['react', 'preact']
      }
    })
  }
}