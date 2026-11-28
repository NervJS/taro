import path from 'node:path'

import { recursiveMerge, resolveScriptPath } from '@tarojs/helper'

import { MultiPlatformPlugin } from '../../resolve/MultiPlatformPlugin'

import type { BundlerPlugin } from './BundlerPlugin'

export const DEFAULT_RESOLVE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.vue']

export class BaseBundlerConfig<TChain = any, TConfig extends Record<string, any> = Record<string, any>> {
  private _chain: TChain
  protected pluginHelper: typeof BundlerPlugin

  constructor (
    appPath: string,
    config: TConfig,
    chain: TChain,
    options: {
      pluginHelper: typeof BundlerPlugin
      extensions?: string[]
      resolvePlugins?: Record<string, any> | false
      plugins?: Record<string, any>
      extraMerge?: Record<string, any>
    }
  ) {
    this._chain = chain
    this.pluginHelper = options.pluginHelper
    const resolveConfig: Record<string, any> = {
      extensions: options.extensions || DEFAULT_RESOLVE_EXTENSIONS,
      symlinks: true,
    }
    const resolvePlugins = options.resolvePlugins === false
      ? undefined
      : (options.resolvePlugins || {
        MultiPlatformPlugin: {
          plugin: MultiPlatformPlugin,
          args: ['described-resolve', 'resolve', { chain }]
        }
      })
    if (resolvePlugins) {
      resolveConfig.plugin = resolvePlugins
    }
    (chain as any).merge({
      target: ['web', 'es5'],
      resolve: resolveConfig,
      resolveLoader: {
        modules: ['node_modules']
      },
      output: {
        chunkLoadingGlobal: 'webpackJsonp'
      },
      plugin: {
        ...this.getProgressPlugins(config),
        ...options.plugins
      },
      watchOptions: {
        aggregateTimeout: 200
      },
      ...options.extraMerge
    })

    this.configureCache(appPath, config)
  }

  protected getProgressPlugins (config: TConfig): Record<string, any> {
    return {
      webpackbar: this.pluginHelper.getWebpackBarPlugin({
        reporters: [
          'basic',
          'fancy',
          {
            done (_context, { stats }) {
              const { reportBuildStats } = require('../logHelper') as typeof import('../logHelper')
              reportBuildStats(stats, config)
            }
          }
        ],
        basic: config.logger?.quiet === true,
        fancy: config.logger?.quiet !== true,
      })
    }
  }

  protected configureCache (appPath: string, config: TConfig): void {
    // 持久化缓存
    if (config.cache?.enable) {
      delete config.cache.enable

      const cacheDefault = {
        type: 'filesystem',
        // 让缓存失效
        buildDependencies: {
          // 与 Config 中处理的配置文件保持一致
          config: [resolveScriptPath(path.join(appPath, 'config', 'index'))],
          files: [resolveScriptPath(path.join(appPath, 'src', 'app.config'))]
        },
        name: `${process.env.NODE_ENV}-${process.env.TARO_ENV}`
      }
      ;(this._chain as any).merge({
        cache: recursiveMerge<any>({}, cacheDefault, config.cache)
      })
    }
  }

  get chain (): TChain {
    return this._chain
  }

  // minimizer 配置
  protected setMinimizer (config: TConfig, defaultTerserOptions) {
    if (config.mode !== 'production') { return }

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
        minimizer.esBuildMinifyPlugin = this.pluginHelper.getESBuildMinifyPlugin(esbuildMinifyOptions)
      }
    } else {
      if (terser?.enable === false) {
        // 只有在明确配置了 terser.enable: false 时才不启用压缩
        minimize = false
      } else {
        const terserOptions = recursiveMerge({}, defaultTerserOptions, terser?.config || {})
        minimizer.terserPlugin = this.pluginHelper.getTerserPlugin(terserOptions)
      }
    }

    /** CSS */
    if (cssMinimizer === 'esbuild') {
      minimizer.esBuildCssPlugin = this.pluginHelper.getCssMinimizerPlugin(cssMinimizer, {})
    } else if (cssMinimizer === 'lightningcss') {
      minimizer.lightningcssPlugin = this.pluginHelper.getCssMinimizerPlugin(cssMinimizer, {})
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
        minimizer.cssoWebpackPlugin = this.pluginHelper.getCssMinimizerPlugin('csso', cssoConfig)
      }
    }

    (this.chain as any).merge({
      optimization: {
        minimize,
        minimizer
      }
    })
  }
}
