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
import { chalk, readConfig, resolveMainFilePath } from '@tarojs/helper'
import fs from 'fs-extra'
import path from 'path'
import { performance } from 'perf_hooks'
import webpack from 'webpack'

import { addLeadingSlash, addTrailingSlash } from '../utils'
import type { H5Combination } from '../webpack/H5Combination'
import { bundle } from './bundle'
import { assetsRE, MF_NAME } from './constant'
import { scanImports } from './scanImports'
import {
  commitMeta,
  createResolve,
  flattenId,
  formatDepsString,
  getBundleHash,
  getCacheDir,
  getMeasure,
  getMfHash,
  getPrebundleOptions,
  Metadata
} from './utils'
import TaroModuleFederationPlugin from './webpack/TaroModuleFederationPlugin'

export async function preBundle (combination: H5Combination) {
  const prebundleOptions = getPrebundleOptions(combination)
  if (!prebundleOptions.enable) return

  const appPath = combination.appPath
  const cacheDir = prebundleOptions.cacheDir || getCacheDir(appPath)
  const prebundleCacheDir = path.resolve(cacheDir, './prebundle')
  const remoteCacheDir = path.resolve(cacheDir, './remote')
  const metadataPath = path.join(cacheDir, 'metadata.json')
  const metadata: Metadata = {}
  const preMetadata: Metadata = {}
  try {
    if (prebundleOptions.force !== true) {
      Object.assign(preMetadata, fs.readJSONSync(metadataPath))
    }
  } catch (e) {}
  let isUseCache = true

  const resolveOptions = combination.chain.toConfig().resolve
  createResolve(appPath, resolveOptions)

  const measure = getMeasure(prebundleOptions.timings)

  const entries: string[] = []
  const config = combination.config
  /**
   * TODO:
   * - [ ] 优化 proxy 方法
   * - [ ] 开发环境依赖更新触发 ws 热加载心跳
   * - [ ] remote 依赖，异步改成同步
   *   - [ ] app.config.js 加载时异步获取相关依赖
   *   - [ ] 回归测试 react、vue、vue3、nerv 加载状态
   * - [ ] 回归多页面应用情况
   * - [ ] 回归 react、vue 热更新状态
   */
  const appJsPath = config.entry!.app[0]
  const appConfigPath = resolveMainFilePath(`${appJsPath.replace(path.extname(appJsPath), '')}.config`)
  const appConfig = readConfig(appConfigPath)

  entries.push(appJsPath)
  appConfig.pages.forEach((page: string) => {
    const pageJsPath = resolveMainFilePath(path.join(appPath, combination.sourceRoot, page))
    entries.push(pageJsPath)
  })

  /**
   * 1. 扫描出所有的 node_modules 依赖
   */
  const SCAN_START = performance.now()

  const deps = await scanImports({
    entries,
    combination,
    include: [
      '@tarojs/taro',
      // '@tarojs/taro-h5',
      '@tarojs/runtime',
      '@tarojs/router',
      ...prebundleOptions.include || []
    ],
    exclude: [
      ...prebundleOptions.exclude || []
    ]
  })

  console.log(chalk.cyan(
    'Prebundle dependencies: \n',
    ...JSON.parse(formatDepsString(deps)).map(dep => `    ${dep[0]}\n`)
  ))

  measure('Scan imports duration', SCAN_START)

  /**
   * 2. 使用 esbuild 对 node_modules 依赖进行 bundle
   */
  const PREBUNDLE_START = performance.now()

  metadata.bundleHash = await getBundleHash(deps, combination, cacheDir)

  if (preMetadata.bundleHash !== metadata.bundleHash) {
    isUseCache = false

    const { metafile } = await bundle(deps, combination, prebundleCacheDir)

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

  measure('Prebundle duration', PREBUNDLE_START)

  /**
   * 3. 把依赖的 bundle 产物打包成 Webpack Module Federation 格式
   */
  const BUILD_LIB_START = performance.now()

  const exposes: Record<string, string> = {}
  const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
  const devtool = combination.enableSourceMap && 'hidden-source-map'
  const mainBuildOutput = combination.chain.output.entries()
  const taroRuntimeBundlePath: string = metadata.taroRuntimeBundlePath || exposes['./@tarojs/runtime']
  const publicPath = config.publicPath ? addLeadingSlash(addTrailingSlash(config.publicPath)) : '/'
  const chunkDirectory = config.chunkDirectory || 'chunk'
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
    isUseCache = false

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
        new TaroModuleFederationPlugin({
          name: MF_NAME,
          filename: 'remoteEntry.js',
          runtime: 'runtime',
          exposes
        }, deps, metadata.remoteAssets, metadata.runtimeRequirements)
      ]
    })
    metadata.remoteAssets = await new Promise((resolve, reject) => {
      compiler.run((error: Error, stats: webpack.Stats) => {
        compiler.close(err => {
          if (error || err) return reject(error || err)
          const { assets } = stats.toJson()
          const remoteAssets = assets
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

  if (process.env.NODE_ENV === 'production' || config.devServer?.devMiddleware?.writeToDisk) {
    fs.copy(remoteCacheDir, mainBuildOutput.path)
  }

  measure(`Build remote ${MF_NAME} duration`, BUILD_LIB_START)

  /**
   * 4. 项目 Host 配置 Module Federation
   */
  const chain = combination.chain
  const MfOpt = {
    name: 'taro-app',
    remotes: {
      [MF_NAME]: `${MF_NAME}@remoteEntry.js`
    }
  }
  chain
    .plugin('TaroModuleFederationPlugin')
    .use(TaroModuleFederationPlugin, [
      MfOpt,
      deps,
      metadata.remoteAssets,
      metadata.runtimeRequirements
    ])

  // node_modules 已预编译，不需要二次加载 (TODO: 修复 esbuild 加载 css 问题后，也应当移除对应规则对依赖的加载)
  const script = chain.module.rule('script')
  script.exclude.add(/node_modules/)

  if (!isUseCache) {
    commitMeta(appPath, metadataPath, metadata)
  }
}
