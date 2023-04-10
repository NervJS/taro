import { chalk, recursiveMerge, resolveScriptPath } from '@tarojs/helper'
import { MultiPlatformPlugin } from '@tarojs/runner-utils'
import path from 'path'
import { Stats } from 'webpack'
import Chain from 'webpack-chain'
import formatMessages from 'webpack-format-messages'

import WebpackPlugin from './WebpackPlugin'

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
        plugin: {
          MultiPlatformPlugin: {
            plugin: MultiPlatformPlugin,
            args: ['described-resolve', 'resolve', { chain }]
          }
        }
      },
      resolveLoader: {
        modules: ['node_modules']
      },
      output: {
        chunkLoadingGlobal: 'webpackJsonp'
      },
      plugin: {
        webpackbar: WebpackPlugin.getWebpackBarPlugin({
          reporters: [
            'basic',
            'fancy',
            {
              done (_context, { stats }: { stats: Stats }) {
                const { warnings, errors } = formatMessages(stats)

                if (stats.hasWarnings()) {
                  console.log(chalk.bgKeyword('orange')('⚠️ Warnings: \n'))
                  warnings.forEach(w => console.log(w + '\n'))
                }

                if (stats.hasErrors()) {
                  console.log(chalk.bgRed('✖ Errors: \n'))
                  errors.forEach(e => console.log(e + '\n'))
                  !config.isWatch && process.exit(1)
                }

                if (config.isWatch) {
                  console.log(chalk.gray(`→ Watching... [${new Date().toLocaleString()}]\n`))
                }

                if (config.logger?.stats === true && config.mode === 'production') {
                  console.log(chalk.bgBlue('ℹ Stats: \n'))
                  console.log(stats.toString({
                    colors: true,
                    modules: false,
                    children: false,
                    chunks: false,
                    chunkModules: false
                  }))
                }
              }
            }
          ],
          basic: config.logger?.quiet === true,
          fancy: config.logger?.quiet !== true,
        })
      },
      watchOptions: {
        aggregateTimeout: 200
      }
    })

    // 持久化缓存
    if (config.cache?.enable) {
      delete config.cache.enable

      const cacheDefault = {
        type: 'filesystem',
        // 让缓存失效
        buildDependencies: {
          // 与 Config 中处理的配置文件保持一致
          config: [resolveScriptPath(path.join(appPath, 'config', 'index'))]
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
