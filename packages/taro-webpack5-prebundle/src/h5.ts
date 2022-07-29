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
import fs from 'fs-extra'
import path from 'path'
import { performance } from 'perf_hooks'
import webpack, { Stats } from 'webpack'
import webpackDevServer from 'webpack-dev-server'
import VirtualModulesPlugin from 'webpack-virtual-modules'

import type { IPrebundle } from './prebundle'
import BasePrebundle, { IPrebundleConfig } from './prebundle'
import {
  createResolve,
  flattenId,
  getMfHash,
  parsePublicPath
} from './utils'
import { assetsRE, MF_NAME } from './utils/constant'
import TaroModuleFederationPlugin from './webpack/TaroModuleFederationPlugin'

export const VirtualModule = new VirtualModulesPlugin()

export interface IH5PrebundleConfig extends IPrebundleConfig {
  chunkFilename?: string
  devServer?: webpackDevServer.Configuration
  publicPath?: string
}

export class H5Prebundle extends BasePrebundle<IH5PrebundleConfig> {
  constructor (protected config: IH5PrebundleConfig, protected option: IPrebundle) {
    super(config, option)
  }

  async buildLib () {
    const BUILD_LIB_START = performance.now()

    const exposes: Record<string, string> = {}
    const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
    const devtool = this.config.enableSourceMap && 'hidden-source-map'
    const mainBuildOutput = this.chain.output.entries()
    const output: Exclude<webpack.Configuration['output'], undefined> = {
      chunkFilename: this.config.chunkFilename,
      chunkLoadingGlobal: mainBuildOutput.chunkLoadingGlobal,
      globalObject: mainBuildOutput.globalObject,
      path: this.remoteCacheDir,
    }

    this.metadata.mfHash = getMfHash({
      bundleHash: this.metadata.bundleHash,
      mode,
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

      const compiler = webpack({
        cache: {
          type: 'filesystem',
          cacheDirectory: path.join(this.cacheDir, 'webpack-cache'),
          buildDependencies: {
            config: Object.values(exposes)
          }
        },
        devtool,
        entry: path.resolve(__dirname, './webpack/index.js'),
        mode,
        module: {
          // TODO 同步普通打包文件配置
          rules: [
            {
              test: assetsRE,
              type: 'asset/resource',
              generator: {
                filename: 'static/[hash][ext][query]'
              }
            }
          ]
        },
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
              remoteAssets: this.metadata.remoteAssets,
              runtimeRequirements: this.metadata.runtimeRequirements
            }
          )
        ]
      })
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

    if (process.env.NODE_ENV === 'production' || this.config.devServer?.devMiddleware?.writeToDisk) {
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
    createResolve(this.appPath, this.chain.toConfig().resolve)

    /** 扫描出所有的 node_modules 依赖 */
    const entries: string[] = this.getEntries(this.entryPath)
    const { include = [], exclude = [] } = this.option
    await this.setDeps(entries, include, exclude)

    /** 使用 esbuild 对 node_modules 依赖进行 bundle */
    await this.bundle()

    /** 把依赖的 bundle 产物打包成 Webpack Module Federation 格式 */
    await this.buildLib()

    /** 项目 Host 配置 Module Federation */
    this.setHost(['', 'auto'].includes(publicPath) ? '' : publicPath.replace(/^\.(\/)?/, '/'))

    /** node_modules 已预编译，不需要二次加载 (TODO: 修复 esbuild 加载 css 问题后，也应当移除对应规则对依赖的加载) */
    const script = this.chain.module.rule('script')
    script.exclude.add(/node_modules/)

    // Proxy
    if (process.env.NODE_ENV !== 'production' || this.config.devServer) {
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
