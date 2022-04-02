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
import * as fs from 'fs-extra'
import * as path from 'path'
import { PerformanceObserver, performance } from 'perf_hooks'
import { resolveMainFilePath, readConfig, chalk } from '@tarojs/helper'
import * as webpack from 'webpack'
import { scanImports } from './scanImports'
import { bundle } from './bundle'
import TaroContainerPlugin from './webpack/TaroContainerPlugin'
import { createResolve, flattenId, getCacheDir, getHash, getDefines } from './utils'

import type { MiniCombination } from '../webpack/MiniCombination'
import type { CollectedDeps } from './constant'

interface Metadata {
  bundleHash?: string
  mfHash?: string
  taroRuntimeBundlePath?: string
  runtimeRequirements?: Set<string>
  remoteAssets?: { name: string }[]
}

export async function preBundle (
  combination: MiniCombination
) {
  const performanceObserver = new PerformanceObserver(items => {
    const list = items.getEntries()
    list.forEach(item => {
      console.log(chalk.cyan(`\n${item.name}: ${Math.round(item.duration)}ms\n`))
    })
  })
  performanceObserver.observe({ type: 'measure' })

  const appPath = combination.appPath
  const cacheDir = getCacheDir(appPath)
  const prebundleCacheDir = path.resolve(cacheDir, './prebundle')
  const remoteCacheDir = path.resolve(cacheDir, './remote')
  const metadataPath = path.join(cacheDir, 'metadata.json')
  const preMetadata: Metadata = fs.readJSONSync(metadataPath) || {}
  const metadata: Metadata = {}
  let isUseCache = true

  const resolveOptions = combination.chain.toConfig().resolve
  createResolve(appPath, resolveOptions)

  /**
   * 找出所有 webpack entry
   * TODO:
   *   - 抽取和 MiniPlugin 的重复逻辑
   *   - 确认是否有除了 App 和 Page 外还需要处理的 entry
   */
  const entries: string[] = []
  const appJsPath = combination.config.entry!.app[0]
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
  performance.mark('scan start')

  const deps = await scanImports({ entries, combination })

  performance.measure('Scan imports duration', 'scan start')

  console.log(chalk.cyan(
    '\nPrebundle dependencies: \n',
    ...[...deps.keys()].map(dep => `    ${dep}\n`)
  ))

  /**
   * 2. 使用 esbuild 对 node_modules 依赖进行 bundle
   */
  performance.mark('prebundle start')

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

  performance.measure('Prebundle duration', 'prebundle start')

  /**
   * 3. 把依赖的 bundle 产物打包成 Webpack Module Federation 格式
   */
  performance.mark('Build lib-app start')

  const exposes = {}
  const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
  const devtool = combination.enableSourceMap && 'hidden-source-map'
  const mainBuildOutput = combination.chain.output.entries()
  const taroRuntimeBundlePath: string = metadata.taroRuntimeBundlePath || exposes['./@tarojs/runtime']
  const output = {
    path: remoteCacheDir,
    chunkLoadingGlobal: mainBuildOutput.chunkLoadingGlobal,
    globalObject: mainBuildOutput.globalObject
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
      entry: path.resolve(__dirname, './webpack/index.js'),
      mode,
      devtool,
      output,
      cache: {
        type: 'filesystem',
        cacheDirectory: path.join(cacheDir, 'webpack-cache'),
        buildDependencies: {
          config: Object.values(exposes)
        }
      },
      plugins: [
        new webpack.container.ModuleFederationPlugin({
          name: 'lib_app',
          filename: 'remoteEntry.js',
          runtime: 'runtime',
          exposes
        }),
        new TaroContainerPlugin(metadata.runtimeRequirements),
        new webpack.ProvidePlugin({
          window: [taroRuntimeBundlePath, 'window$1'],
          document: [taroRuntimeBundlePath, 'document$1'],
          navigator: [taroRuntimeBundlePath, 'navigator'],
          requestAnimationFrame: [taroRuntimeBundlePath, 'raf'],
          cancelAnimationFrame: [taroRuntimeBundlePath, 'caf'],
          Element: [taroRuntimeBundlePath, 'TaroElement'],
          SVGElement: [taroRuntimeBundlePath, 'SVGElement'],
          MutationObserver: [taroRuntimeBundlePath, 'MutationObserver']
        })
      ]
    })
    metadata.remoteAssets = await new Promise((resolve, reject) => {
      compiler.run((err: Error, stats: webpack.Stats) => {
        compiler.close(err2 => {
          if (err || err2) return reject(err || err2)
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

  fs.copy(remoteCacheDir, path.join(mainBuildOutput.path, 'prebundle'))

  performance.measure('Build Remote lib-app duration', 'Build lib-app start')

  /**
   * 4. 项目 Host 配置 Module Federation
   */
  const chain = combination.chain
  const mfOptions = {
    name: 'main_app',
    remotes: {
      'lib-app': 'lib_app@http://localhost:3000/remoteEntry.js'
    }
  }
  chain
    .plugin('ModuleFederationPlugin')
    .use(webpack.container.ModuleFederationPlugin, [mfOptions])
  chain
    .plugin('TaroContainerReferencePlugin')
    .use(path.resolve(__dirname, './webpack/TaroContainerReferencePlugin.js'), [
      mfOptions,
      deps,
      metadata.remoteAssets,
      metadata.runtimeRequirements
    ])

  if (!isUseCache) {
    commit(appPath, metadataPath, metadata)
  }
}

async function getBundleHash (deps: CollectedDeps, combination: MiniCombination, cacheDir: string): Promise<string> {
  const appPath = combination.appPath
  const defines = getDefines(combination)
  const lockfiles = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml']
  const lockfilesContents = await Promise.all(lockfiles.map(item => {
    return new Promise<string>(resolve => {
      fs.readFile(path.join(appPath, item))
        .then(content => resolve(content.toString()))
        .catch(() => resolve(''))
    })
  }))
  return getHash(
    formatDepsString(deps) +
    lockfilesContents.join('\n') +
    JSON.stringify(defines) +
    cacheDir
  )
}

function formatDepsString (deps: CollectedDeps) {
  const list = Array.from(deps.entries())
  list.sort((a, b) => a[0].localeCompare(b[0]))
  return JSON.stringify(list)
}

function getMfHash (obj: Record<string, any>) {
  return getHash(JSON.stringify(obj))
}

async function commit (appPath: string, metadataPath: string, metadata: Metadata) {
  // Todo: 改为相对路径
  await fs.writeJSON(metadataPath, metadata, {
    spaces: 2,
    replacer (key, value) {
      if (value instanceof Set) {
        return Array.from(value)
      }
      if (key === 'taroRuntimeBundlePath') {
        return path.relative(appPath, value)
      }
      return value
    }
  })
}
