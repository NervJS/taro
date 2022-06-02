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

import type { MiniCombination } from '../webpack/MiniCombination'
import { bundle } from './bundle'
import { MF_NAME } from './constant'
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
  Metadata
} from './utils'
import TaroModuleFederationPlugin from './webpack/TaroModuleFederationPlugin'

export async function preBundle (combination: MiniCombination) {
  const prebundleOptions = combination.getPrebundleOptions()
  if (!prebundleOptions.enable) return

  const appPath = combination.appPath
  const cacheDir = prebundleOptions.cacheDir || getCacheDir(appPath)
  const customEsbuildConfig = prebundleOptions.esbuild || {}
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

  /**
   * 找出所有 webpack entry
   * TODO:
   *   - 目前只处理了 Page entry，例如原生小程序组件 js entry 等并没有处理
   */
  const entries: string[] = []
  const config = combination.config
  const appJsPath = config.entry!.app[0]
  const appConfigPath = resolveMainFilePath(`${appJsPath.replace(path.extname(appJsPath), '')}.config`)
  const appConfig = readConfig(appConfigPath)

  entries.push(appJsPath)
  appConfig.pages.forEach((page: string) => {
    const pageJsPath = resolveMainFilePath(path.join(appPath, combination.sourceRoot, page))
    entries.push(pageJsPath)
  })

  // console.log('\nPrebundle entries: \n', ...entries.map(entry => `\t${entry}\n`, '\n'))

  /**
   * 1. 扫描出所有的 node_modules 依赖
   */
  const SCAN_START = performance.now()

  // plugin-platform 等插件的 runtime 文件入口
  let runtimePath = typeof config.runtimePath === 'string' ? [config.runtimePath] : config.runtimePath || []
  runtimePath = runtimePath.map(item => item.replace(/^post:/, ''))
  const deps = await scanImports({
    entries,
    combination,
    include: [
      '@tarojs/taro',
      '@tarojs/runtime',
      ...runtimePath,
      ...prebundleOptions.include || []
    ],
    exclude: [
      // 小程序编译 Host 时需要扫描 @tarojs/components 的 useExports，因此不能被 external
      '@tarojs/components',
      ...prebundleOptions.exclude || []
    ],
    customEsbuildConfig
  })

  deps.size &&
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

    const { metafile } = await bundle(deps, combination, prebundleCacheDir, customEsbuildConfig)

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
  const output = {
    path: remoteCacheDir,
    chunkLoadingGlobal: mainBuildOutput.chunkLoadingGlobal,
    globalObject: mainBuildOutput.globalObject
  }
  const provideObject = {
    window: [taroRuntimeBundlePath, 'window$1'],
    document: [taroRuntimeBundlePath, 'document$1'],
    navigator: [taroRuntimeBundlePath, 'navigator'],
    requestAnimationFrame: [taroRuntimeBundlePath, 'raf'],
    cancelAnimationFrame: [taroRuntimeBundlePath, 'caf'],
    Element: [taroRuntimeBundlePath, 'TaroElement'],
    SVGElement: [taroRuntimeBundlePath, 'SVGElement'],
    MutationObserver: [taroRuntimeBundlePath, 'MutationObserver']
  }
  const customWebpackConfig = prebundleOptions.webpack || {}
  if (customWebpackConfig.provide?.length) {
    customWebpackConfig.provide.forEach(cb => {
      cb(provideObject, taroRuntimeBundlePath)
    })
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

    for (const id of deps.keys()) {
      const flatId = flattenId(id)
      exposes[`./${id}`] = path.join(prebundleCacheDir, `${flatId}.js`)
    }
    metadata.runtimeRequirements = new Set<string>()

    const compiler = webpack({
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
        }, deps, metadata.remoteAssets, metadata.runtimeRequirements),
        new webpack.ProvidePlugin(provideObject)
      ],
      cache: {
        type: 'filesystem',
        cacheDirectory: path.join(cacheDir, 'webpack-cache'),
        buildDependencies: {
          config: Object.values(exposes)
        }
      }
    })
    metadata.remoteAssets = await new Promise((resolve, reject) => {
      compiler.run((error: Error, stats: webpack.Stats) => {
        compiler.close(err => {
          if (error || err) return reject(error || err)
          const { assets = [], errors = [] } = stats.toJson()
          if (errors[0]) return reject(errors[0])
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

  fs.copy(remoteCacheDir, path.join(mainBuildOutput.path, 'prebundle'))

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

  if (!isUseCache) {
    commitMeta(appPath, metadataPath, metadata)
  }
}
