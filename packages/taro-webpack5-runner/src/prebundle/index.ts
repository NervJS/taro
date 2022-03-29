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
import * as path from 'path'
import { PerformanceObserver, performance } from 'perf_hooks'
import { resolveMainFilePath, readConfig, chalk } from '@tarojs/helper'
import * as webpack from 'webpack'
import { scanImports } from './scanImports'
import { bundle } from './bundle'
import TaroContainerPlugin from './webpack/TaroContainerPlugin'
import { createResolve, flattenId, getDepsCacheDir } from './utils'

import type { MiniCombination } from '../webpack/MiniCombination'

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

  const resolveOptions = combination.chain.toConfig().resolve
  createResolve(appPath, resolveOptions)

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

  const { metafile } = await bundle(deps, combination)

  performance.measure('Prebundle duration', 'prebundle start')

  /**
   * 3. 把依赖的 bundle 产物打包成 Webpack Module Federation 格式
   */
  performance.mark('Build lib-app start')

  const exposes = {}
  const depsCacheDir = getDepsCacheDir(appPath)
  for (const id of deps.keys()) {
    const flatId = flattenId(id)
    exposes[`./${id}`] = path.join(depsCacheDir, `${flatId}.js`)
  }

  const mainBuildOutput = combination.chain.output.entries()
  let taroRuntimeBundlePath = exposes['./@tarojs/runtime']

  Object.keys(metafile.outputs).some(key => {
    const output = metafile.outputs[key]
    if (output.entryPoint === 'entry:@tarojs_runtime') {
      const dep = output.imports.find(dep => {
        const depPath = dep.path
        const output = metafile.outputs[depPath]
        return output.exports.includes('TaroRootElement')
      })
      if (dep) {
        taroRuntimeBundlePath = path.join(appPath, dep.path)
      }
      return true
    }
  })

  const compiler = webpack({
    entry: path.resolve(__dirname, './webpack/index.js'),
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devtool: 'hidden-source-map',
    output: {
      ...mainBuildOutput,
      path: path.join(mainBuildOutput.path, 'prebundle')
    },
    plugins: [
      new webpack.container.ModuleFederationPlugin({
        name: 'lib_app',
        filename: 'remoteEntry.js',
        runtime: 'runtime',
        exposes
      }),
      new TaroContainerPlugin(),
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
  const stats = await new Promise((resolve, reject) => {
    compiler.run((err: Error, stats: webpack.Stats) => {
      compiler.close(err2 => {
        if (err || err2) return reject(err || err2)
        performance.measure('Build Remote lib-app duration', 'Build lib-app start')
        resolve(stats.toJson())
      })
    })
  })

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
      stats
    ])
}
