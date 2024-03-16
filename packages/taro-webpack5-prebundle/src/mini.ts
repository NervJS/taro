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
import { fs } from '@tarojs/helper'
import path from 'path'
import { performance } from 'perf_hooks'
import { ProvidePlugin } from 'webpack'

import BasePrebundle, { IPrebundleConfig } from './prebundle'
import { bundle } from './prebundle/bundle'
import {
  flattenId,
  getBundleHash,
  getMfHash
} from './utils'
import { MF_NAME } from './utils/constant'
import TaroModuleFederationPlugin from './webpack/TaroModuleFederationPlugin'

import type { Stats } from 'webpack'

export interface IMiniPrebundleConfig extends IPrebundleConfig {
  runtimePath?: string | string[]
  isBuildPlugin?: boolean
}

export class MiniPrebundle extends BasePrebundle<IMiniPrebundleConfig> {
  getIsBuildPluginPath (filePath, isBuildPlugin) {
    return isBuildPlugin ? `${filePath}/plugin` : filePath
  }

  async bundle () {
    const PREBUNDLE_START = performance.now()

    this.metadata.bundleHash = await getBundleHash(this.appPath, this.deps, this.chain, this.cacheDir)

    if (this.preMetadata.bundleHash !== this.metadata.bundleHash) {
      this.isUseCache = false

      try {
        const { metafile } = await bundle({
          appPath: this.appPath,
          deps: this.deps,
          chain: this.chain,
          prebundleOutputDir: this.prebundleCacheDir,
          customEsbuildConfig: this.customEsbuildConfig,
          customSwcConfig: this.customSwcConfig
        })

        // 找出 @tarojs/runtime 被 split 切分的 chunk，作为后续 ProvidePlugin 的提供者。
        // 原因是 @tarojs/runtime 里使用了一些如 raf、caf 等全局变量，又因为 esbuild 把
        // @tarojs/runtime split 成 entry 和依赖 chunk 两部分。如果我们把 entry 作为
        // ProvidePlugin 的提供者，依赖 chunk 会被注入 raf、caf，导致循环依赖的问题。所以
        // 这种情况下只能把依赖 chunk 作为 ProvidePlugin 的提供者。
        metafile && Object.keys(metafile.outputs).some(key => {
          const output = metafile.outputs[key]
          if (output.entryPoint === 'entry:@tarojs_runtime') {
            const dep = output.imports.find(dep => {
              const depPath = dep.path
              const depOutput = metafile.outputs[depPath]
              return depOutput.exports.includes('TaroRootElement')
            })
            if (dep) {
              this.metadata.taroRuntimeBundlePath = path.join(this.appPath, dep.path)
            }
            return true
          }
        })
      } catch (result) {
        return this.handleBundleError(result?.errors)
      }
    } else {
      this.metadata.taroRuntimeBundlePath = path.join(this.appPath, this.preMetadata.taroRuntimeBundlePath!)
    }

    this.measure('Prebundle duration', PREBUNDLE_START)
  }

  async buildLib () {
    const BUILD_LIB_START = performance.now()

    const exposes: Record<string, string> = {}
    const devtool = this.config.enableSourceMap && 'hidden-source-map'
    const mainBuildOutput = this.chain.output.entries()
    const taroRuntimeBundlePath: string = this.metadata.taroRuntimeBundlePath || exposes['./@tarojs/runtime']
    const output = {
      path: this.remoteCacheDir,
      chunkLoadingGlobal: mainBuildOutput.chunkLoadingGlobal,
      globalObject: mainBuildOutput.globalObject
    }
    const provideObject = {
      window: [taroRuntimeBundlePath, 'window$1'],
      document: [taroRuntimeBundlePath, 'document$1'],
      navigator: [taroRuntimeBundlePath, 'nav'],
      requestAnimationFrame: [taroRuntimeBundlePath, '_raf'],
      cancelAnimationFrame: [taroRuntimeBundlePath, '_caf'],
      Element: [taroRuntimeBundlePath, 'TaroElement'],
      SVGElement: [taroRuntimeBundlePath, 'SVGElement'],
      MutationObserver: [taroRuntimeBundlePath, 'MutationObserver'],
      history: [taroRuntimeBundlePath, 'history'],
      location: [taroRuntimeBundlePath, 'location'],
      URLSearchParams: [taroRuntimeBundlePath, 'URLSearchParams'],
      URL: [taroRuntimeBundlePath, 'URL'],
    }
    const customWebpackConfig = this.option.webpack
    if (customWebpackConfig?.provide?.length) {
      customWebpackConfig.provide.forEach(cb => {
        cb(provideObject, taroRuntimeBundlePath)
      })
      delete customWebpackConfig.provide
    }

    this.metadata.mfHash = getMfHash({
      bundleHash: this.metadata.bundleHash,
      mode: this.mode,
      devtool,
      output,
      taroRuntimeBundlePath
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
              isBuildPlugin: this.config.isBuildPlugin,
              runtimeRequirements: this.metadata.runtimeRequirements
            }
          ),
          new ProvidePlugin(provideObject)
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
                ?.filter(
                  item => this.config.isBuildPlugin
                    ? item.name !== 'plugin/runtime.js'
                    : item.name !== 'runtime.js'
                )
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

    fs.copy(this.remoteCacheDir, path.join(this.getIsBuildPluginPath(mainBuildOutput.path, this.config.isBuildPlugin), 'prebundle'))

    this.measure(`Build remote ${MF_NAME} duration`, BUILD_LIB_START)
  }

  async run () {
    this.isUseCache = true

    /** 扫描出所有的 node_modules 依赖 */
    /**
     * 找出所有 webpack entry
     * TODO:
     *   - 目前只处理了 Page entry，例如原生小程序组件 js entry 等并没有处理
     */
    const entries: string[] = this.getEntries(this.entryPath)
    // plugin-platform 等插件的 runtime 文件入口
    const runtimePath = typeof this.config.runtimePath === 'string' ? [this.config.runtimePath] : this.config.runtimePath || []
    const { include = [], exclude = [] } = this.option
    await this.setDeps(entries, include.concat(
      ...runtimePath.map(item => item.replace(/^post:/, '')),
    ), exclude)

    /** 使用 esbuild 对 node_modules 依赖进行 bundle */
    await this.bundle()

    /** 把依赖的 bundle 产物打包成 Webpack Module Federation 格式 */
    await this.buildLib()

    /** 项目 Host 配置 Module Federation */
    this.setHost()

    await super.run()
  }
}
