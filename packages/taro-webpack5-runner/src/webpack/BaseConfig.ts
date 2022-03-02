import * as path from 'path'
import * as Chain from 'webpack-chain'
import { recursiveMerge } from '@tarojs/helper'
import { MultiPlatformPlugin } from '@tarojs/runner-utils'
import { WebpackPlugin } from './WebpackPlugin'

import type { H5BuildConfig, MiniBuildConfig } from '../utils/types'

type Config = Partial<MiniBuildConfig | H5BuildConfig>

export class BaseConfig {
  private _chain: Chain

  constructor (appPath: string, config: Config) {
    const chain = this._chain = new Chain()
    chain.merge({
      target: ['web', 'es5'],
      resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.vue'],
        symlinks: true,
        modules: [path.join(appPath, 'node_modules'), 'node_modules'],
        plugin: {
          MultiPlatformPlugin: {
            plugin: MultiPlatformPlugin,
            args: ['described-resolve', 'resolve', { chain }]
          }
        }
      },
      resolveLoader: {
        modules: [path.resolve(__dirname, '../../node_modules'), 'node_modules']
      }
    })

    // 持久化缓存
    if (config.cache?.enable) {
      delete config.cache.enable

      const cacheDefault = {
        type: 'filesystem',
        // 让缓存失效
        buildDependencies: {
          config: [path.join(appPath, 'config/index.js')]
        },
        name: `${process.env.NODE_ENV}-${process.env.TARO_ENV}`
      }
      chain.merge({
        cache: recursiveMerge<any>({}, cacheDefault, config.cache)
      })
    }
  }

  get chain () {
    return this._chain
  }

  // minimizer 配置
  protected setMinimizer (config: Config, defaultTerserOptions) {
    if (config.mode !== 'production') return

    let minimize = true
    const minimizer: Record<string, any> = {}
    const {
      jsMinimizer = 'terser',
      cssMinimizer = 'csso',
      terser,
      esbuild,
      csso
    } = config

    /** JS */
    if (jsMinimizer === 'esbuild') {
      if (esbuild?.minify?.enable === false) {
        // 只有在明确配置了 esbuild.minify.enable: false 时才不启用压缩
        minimize = false
      } else {
        const defaultESBuildOptions = {
          target: 'es5'
        }
        const esbuildMinifyOptions = recursiveMerge({}, defaultESBuildOptions, esbuild?.minify?.config || {})
        minimizer.esBuildMinifyPlugin = WebpackPlugin.getESBuildMinifyPlugin(esbuildMinifyOptions)
      }
    } else {
      if (terser?.enable === false) {
        // 只有在明确配置了 terser.enable: false 时才不启用压缩
        minimize = false
      } else {
        const terserOptions = recursiveMerge({}, defaultTerserOptions, terser?.config || {})
        minimizer.terserPlugin = WebpackPlugin.getTerserPlugin(terserOptions)
      }
    }

    /** CSS */
    if (cssMinimizer === 'esbuild') {
      minimizer.esBuildCssPlugin = WebpackPlugin.getCssMinimizerPlugin(cssMinimizer, {})
    } else if (cssMinimizer === 'parcelCss') {
      minimizer.parcelCssPlugin = WebpackPlugin.getCssMinimizerPlugin(cssMinimizer, {})
    } else {
      if (csso?.enable !== false) {
        const defaultOption = {
          mergeRules: false,
          mergeIdents: false,
          reduceIdents: false,
          discardUnused: false,
          minifySelectors: false
        }

        const cssoConfig = Object.assign(defaultOption, csso?.config || {})
        minimizer.cssoWebpackPlugin = WebpackPlugin.getCssMinimizerPlugin('csso', cssoConfig)
      }
    }

    this.chain.merge({
      optimization: {
        minimize,
        minimizer
      }
    })
  }
}
