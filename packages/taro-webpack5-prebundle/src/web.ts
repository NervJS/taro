// Inspired by [vite](https://github.com/vitejs/vite)
/** @license
 * MIT License
 *
 * Copyright (c) 2019-present, Yuxi (Evan) You and Vite contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { chalk, fs } from '@tarojs/helper'
import path from 'path'
import { performance } from 'perf_hooks'
import VirtualModulesPlugin from 'webpack-virtual-modules'

import BasePrebundle, { IPrebundleConfig } from './prebundle'
import {
  flattenId,
  getMfHash,
  parsePublicPath
} from './utils'
import { MF_NAME } from './utils/constant'
import TaroModuleFederationPlugin from './webpack/TaroModuleFederationPlugin'

import type { Configuration, Stats } from 'webpack'
import type webpackDevServer from 'webpack-dev-server'
import type { IPrebundle } from './prebundle'

export const VirtualModule = new VirtualModulesPlugin()

export interface IWebPrebundleConfig extends IPrebundleConfig {
  runtimePath?: string | string[]
  chunkFilename?: string
  devServer?: webpackDevServer.Configuration
  publicPath?: string
}

export class WebPrebundle extends BasePrebundle<IWebPrebundleConfig> {
  constructor (protected config: IWebPrebundleConfig, protected option: IPrebundle) {
    super(config, option)
  }

  async buildLib () {
    const BUILD_LIB_START = performance.now()

    const customWebpackConfig = this.option.webpack
    const exposes: Record<string, string> = {}
    const devtool = this.config.enableSourceMap && 'hidden-source-map'
    const mainBuildOutput = this.chain.output.entries()
    const output: Exclude<Configuration['output'], undefined> = {
      chunkFilename: this.config.chunkFilename,
      chunkLoadingGlobal: mainBuildOutput.chunkLoadingGlobal,
      globalObject: mainBuildOutput.globalObject,
      path: this.remoteCacheDir,
    }

    this.metadata.mfHash = getMfHash({
      bundleHash: this.metadata.bundleHash,
      mode: this.mode,
      devtool,
      output
    })

    if (this.preMetadata.mfHash !== this.metadata.mfHash) {
      this.isUseCache = false

      fs.existsSync(this.remoteCacheDir) && fs.emptyDirSync(this.remoteCacheDir)

      for (const id of this.deps.keys()) {
        const flatId = flattenId(id)
        exposes[`./${id}`] = path.join(this.prebundleCacheDir, `${flatId}.js`)
      }

      this.metadata.runtimeRequirements = new Set<string>()

      const compiler = this.getRemoteWebpackCompiler({
        cache: {
          type: 'filesystem',
          cacheDirectory: path.join(this.cacheDir, 'webpack-cache'),
          buildDependencies: {
            config: Object.values(exposes)
          }
        },
        devtool,
        entry: path.resolve(__dirname, './webpack/index.js'),
        mode: this.mode,
        output,
        plugins: [
          new TaroModuleFederationPlugin(
            {
              name: MF_NAME,
              filename: 'remoteEntry.js',
              runtime: 'runtime',
              exposes
            },
            {
              deps: this.deps,
              env: this.env,
              platformType: this.platformType,
              remoteAssets: this.metadata.remoteAssets,
              runtimeRequirements: this.metadata.runtimeRequirements
            }
          )
        ]
      }, customWebpackConfig)
      this.metadata.remoteAssets = await new Promise((resolve, reject) => {
        compiler.run((error: Error, stats: Stats) => {
          compiler.close(err => {
            if (error || err) return reject(error || err)
            const { assets = [], errors = [] } = stats.toJson()
            if (errors[0]) return reject(errors[0])
            const remoteAssets =
              assets
                ?.filter(item => item.name !== 'runtime.js')
                ?.map(item => ({
                  name: path.join('prebundle', item.name)
                })) || []
            resolve(remoteAssets)
          })
        })
      })
    } else {
      this.metadata.runtimeRequirements = new Set(this.preMetadata.runtimeRequirements)
      this.metadata.remoteAssets = this.preMetadata.remoteAssets
    }

    if (this.mode === 'production' || this.config.devServer?.devMiddleware?.writeToDisk) {
      fs.copy(this.remoteCacheDir, mainBuildOutput.path)
    }

    this.measure(`Build remote ${MF_NAME} duration`, BUILD_LIB_START)
  }

  /**
   * TODO:
   * - [ ] 开发环境依赖更新触发 ws 热加载心跳
   * - [ ] 回归 react、vue 热更新状态
   */
  async run () {
    const publicPath = parsePublicPath(this.config.publicPath)
    /** Note: 新增 web 虚拟入口，用于同步加载 webpack 动态依赖 */
    this.addPlugin('VirtualModule', VirtualModule)

    this.isUseCache = true

    /** 扫描出所有的 node_modules 依赖 */
    const entries: string[] = this.getEntries(this.entryPath)
    const { include = [], exclude = [] } = this.option
    const idx = exclude.findIndex(e => e === '@tarojs/runtime')
    if (idx >= 0) {
      exclude.splice(idx, 1)
      console.log(
        chalk.yellowBright(
          `依赖预编译排除 @tarojs/runtime 依赖会导致应用实例错误, 已为您忽略该配置！`
        ),
      )
    }
    // plugin-platform 等插件的 runtime 文件入口
    const runtimePath = typeof this.config.runtimePath === 'string' ? [this.config.runtimePath] : this.config.runtimePath || []
    await this.setDeps(entries, include.concat(
      ...runtimePath.map(item => item.replace(/^post:/, '')),
    ), exclude)

    /** 使用 esbuild 对 node_modules 依赖进行 bundle */
    await this.bundle()

    /** 把依赖的 bundle 产物打包成 Webpack Module Federation 格式 */
    await this.buildLib()

    /** 项目 Host 配置 Module Federation */
    this.setHost(['', 'auto'].includes(publicPath) ? '' : publicPath.replace(/^\.(\/)?/, '/'))

    const script = this.chain.module.rule('script')
    Array.from(this.deps.keys()).map(dep => {
      /** node_modules 已预编译，不需要二次加载 (TODO: 修复 esbuild 加载 css 问题后，也应当移除对应规则对依赖的加载) */
      script.exclude.add(new RegExp(`node_modules[/\\\\]${dep.replace(/\//g, '\\/')}`))
    })

    // Proxy
    if (this.mode !== 'production' || this.config.devServer) {
      this.chain.devServer.merge({
        static: [{
          directory: this.remoteCacheDir,
          publicPath,
          watch: true,
          staticOptions: {
            immutable: true
          }
        }]
      })
    }

    await super.run()
  }
}
