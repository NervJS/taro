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
import webpack from 'webpack'
import webpackDevServer from 'webpack-dev-server'
import VirtualModulesPlugin from 'webpack-virtual-modules'

import BasePrebundle, { IPrebundleConfig } from './prebundle'
import { bundle } from './prebundle/bundle'
import {
  addLeadingSlash,
  addTrailingSlash,
  createResolve,
  flattenId,
  getBundleHash,
  getMfHash
} from './utils'
import { assetsRE, MF_NAME } from './utils/constant'
import TaroModuleFederationPlugin from './webpack/TaroModuleFederationPlugin'

export const VirtualModule = new VirtualModulesPlugin()

export interface IH5PrebundleConfig extends IPrebundleConfig {
  devServer?: webpackDevServer.Configuration
  publicPath?: string
}

export default class H5Prebundle extends BasePrebundle<IH5PrebundleConfig> {
  /**
   * TODO:
   * - [ ] 优化 proxy 方法
   * - [ ] 开发环境依赖更新触发 ws 热加载心跳
   * - [ ] 回归 react、vue 热更新状态
   */
  async run () {
    // Note: 新增 web 虚拟入口，用于同步加载 webpack 动态依赖
    this.addPlugin('VirtualModule', VirtualModule)

    const { appPath, cacheDir, customEsbuildConfig, prebundleCacheDir, remoteCacheDir, metadata, preMetadata } = this
    this.isUseCache = true

    const resolveOptions = this.chain.toConfig().resolve
    createResolve(appPath, resolveOptions)

    const { chunkDirectory = 'chunk', entryFileName = 'app', entry = {} } = this.config
    const { include = [], exclude = [] } = this.option

    /** 1. 扫描出所有的 node_modules 依赖 */
    const entries: string[] = this.getEntries(entry[entryFileName][0])
    const deps = await this.getDeps(
      entries,
      ['@tarojs/taro', '@tarojs/runtime', '@tarojs/router'].concat(include),
      exclude
    )

    /** 2. 使用 esbuild 对 node_modules 依赖进行 bundle */
    const PREBUNDLE_START = performance.now()

    metadata.bundleHash = await getBundleHash(appPath, deps, this.chain, cacheDir)

    if (preMetadata.bundleHash !== metadata.bundleHash) {
      this.isUseCache = false

      const { metafile } = await bundle(appPath, deps, this.chain, prebundleCacheDir, customEsbuildConfig)

      // 找出 @tarojs/runtime 被 split 切分的 chunk，作为后续 ProvidePlugin 的提供者。
      // 原因是 @tarojs/runtime 里使用了一些如 raf、caf 等全局变量，又因为 esbuild 把
      // @tarojs/runtime split 成 entry 和依赖 chunk 两部分。如果我们把 entry 作为
      // ProvidePlugin 的提供者，依赖 chunk 会被注入 raf、caf，导致循环依赖的问题。所以
      // 这种情况下只能把依赖 chunk 作为 ProvidePlugin 的提供者。
      Object.keys(metafile.outputs).some(key => {
        const output = metafile.outputs[key]
        if (output.entryPoint === 'entry:@tarojs_runtime') {
          const dep = output.imports.find(dep => {
            const depPath = dep.path
            const depOutput = metafile.outputs[depPath]
            return depOutput.exports.includes('TaroRootElement')
          })
          if (dep) {
            metadata.taroRuntimeBundlePath = path.join(appPath, dep.path)
          }
          return true
        }
      })
    } else {
      metadata.taroRuntimeBundlePath = path.join(appPath, preMetadata.taroRuntimeBundlePath!)
    }

    this.measure('Prebundle duration', PREBUNDLE_START)

    /** 3. 把依赖的 bundle 产物打包成 Webpack Module Federation 格式 */
    const BUILD_LIB_START = performance.now()

    const exposes: Record<string, string> = {}
    const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
    const devtool = this.config.enableSourceMap && 'hidden-source-map'
    const mainBuildOutput = this.chain.output.entries()
    const taroRuntimeBundlePath: string = metadata.taroRuntimeBundlePath || exposes['./@tarojs/runtime']
    const publicPath = this.config.publicPath ? addLeadingSlash(addTrailingSlash(this.config.publicPath)) : '/'
    const output = {
      chunkFilename: `${chunkDirectory}/[name].js`,
      chunkLoadingGlobal: mainBuildOutput.chunkLoadingGlobal,
      globalObject: mainBuildOutput.globalObject,
      path: remoteCacheDir,
      publicPath
    }
    for (const id of deps.keys()) {
      const flatId = flattenId(id)
      exposes[`./${id}`] = path.join(prebundleCacheDir, `${flatId}.js`)
    }

    metadata.mfHash = getMfHash({
      bundleHash: metadata.bundleHash,
      mode,
      devtool,
      output,
      taroRuntimeBundlePath
    })

    if (preMetadata.mfHash !== metadata.mfHash) {
      this.isUseCache = false

      fs.existsSync(remoteCacheDir) && fs.emptyDirSync(remoteCacheDir)

      metadata.runtimeRequirements = new Set<string>()

      const compiler = webpack({
        cache: {
          type: 'filesystem',
          cacheDirectory: path.join(cacheDir, 'webpack-cache'),
          buildDependencies: {
            config: Object.values(exposes)
          }
        },
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
        devtool,
        entry: path.resolve(__dirname, './webpack/index.js'),
        mode,
        output,
        plugins: [
          new TaroModuleFederationPlugin(
            {
              name: MF_NAME,
              filename: 'remoteEntry.js',
              runtime: 'runtime',
              exposes
            },
            deps,
            metadata.remoteAssets,
            metadata.runtimeRequirements
          )
        ]
      })
      metadata.remoteAssets = await new Promise((resolve, reject) => {
        compiler.run((error: Error, stats: webpack.Stats) => {
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
      metadata.runtimeRequirements = new Set(preMetadata.runtimeRequirements)
      metadata.remoteAssets = preMetadata.remoteAssets
    }

    if (process.env.NODE_ENV === 'production' || this.config.devServer?.devMiddleware?.writeToDisk) {
      fs.copy(remoteCacheDir, mainBuildOutput.path)
    }

    this.measure(`Build remote ${MF_NAME} duration`, BUILD_LIB_START)

    /** 4. 项目 Host 配置 Module Federation */
    const MfOpt = {
      name: 'taro-app',
      remotes: {
        [MF_NAME]: `${MF_NAME}@remoteEntry.js`
      }
    }
    this.chain
      .plugin('TaroModuleFederationPlugin')
      .use(TaroModuleFederationPlugin, [MfOpt, deps, metadata.remoteAssets, metadata.runtimeRequirements])

    // node_modules 已预编译，不需要二次加载 (TODO: 修复 esbuild 加载 css 问题后，也应当移除对应规则对依赖的加载)
    const script = this.chain.module.rule('script')
    script.exclude.add(/node_modules/)
  }
}
