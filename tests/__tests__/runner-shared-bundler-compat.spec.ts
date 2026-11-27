import { spawnSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import MiniSplitChunksPlugin from '@tarojs/webpack5-runner/dist/plugins/MiniSplitChunksPlugin'
import { WebpackModule } from '@tarojs/webpack5-runner/dist/webpack/WebpackModule'
import WebpackPlugin from '@tarojs/webpack5-runner/dist/webpack/WebpackPlugin'
import { AsyncSeriesHook, SyncHook } from 'tapable'

const webpack = jest.requireActual('webpack')
const repoRoot = path.resolve(__dirname, '../..')
const tscScript = require.resolve('typescript/bin/tsc', { paths: [repoRoot] })
const runnerUtilsRoot = path.resolve(repoRoot, 'packages/taro-runner-utils')
const webpack5RunnerRoot = path.resolve(repoRoot, 'packages/taro-webpack5-runner')

function expectTscOk (cwd: string, args: string[]) {
  const { status, stdout, stderr } = spawnSync(process.execPath, [tscScript, ...args], { cwd, encoding: 'utf8' })
  expect({ status, stdout, stderr }).toEqual({ status: 0, stdout: '', stderr: '' })
}

function withTempDir (prefix: string, fn: (dir: string) => void) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix))
  try {
    fn(dir)
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
}

describe('shared bundler compatibility', () => {
  test('WebpackModule and WebpackPlugin keep class exports and destructured static calls', () => {
    const { getLoader, getCSSLoader, getExtractCSSLoader } = WebpackModule
    const { getProviderPlugin, getDefinePlugin } = WebpackPlugin

    expect(new WebpackModule()).toBeInstanceOf(WebpackModule)
    expect(new WebpackPlugin()).toBeInstanceOf(WebpackPlugin)
    expect(getLoader('css-loader', { importLoaders: 2 })).toEqual({
      loader: expect.stringContaining('css-loader'),
      options: { importLoaders: 2 },
    })
    expect(getCSSLoader({ modules: true }).options).toEqual({ importLoaders: 1, modules: true })
    expect(getExtractCSSLoader().loader).toBeDefined()
    expect(getProviderPlugin({ React: 'react' })).toEqual(WebpackPlugin.getProviderPlugin({ React: 'react' }))
    expect(getDefinePlugin([{ A: '1' }])).toEqual(WebpackPlugin.getDefinePlugin([{ A: '1' }]))

    withTempDir('taro-webpack-class-type-', tmpDir => {
      const scopeDir = path.join(tmpDir, 'node_modules', '@tarojs')
      fs.mkdirSync(scopeDir, { recursive: true })
      fs.symlinkSync(webpack5RunnerRoot, path.join(scopeDir, 'webpack5-runner'), 'junction')
      fs.symlinkSync(runnerUtilsRoot, path.join(scopeDir, 'runner-utils'), 'junction')

      const file = path.join(tmpDir, 'consumer.ts')
      fs.writeFileSync(file, [
        "import type { WebpackModule as DistMod } from '@tarojs/webpack5-runner/dist/webpack/WebpackModule'",
        "import type DistPlugin from '@tarojs/webpack5-runner/dist/webpack/WebpackPlugin'",
        "import type { WebpackModule as SrcMod } from '@tarojs/webpack5-runner/src/webpack/WebpackModule'",
        "import type SrcPlugin from '@tarojs/webpack5-runner/src/webpack/WebpackPlugin'",
        'export const accept = (a: DistMod, b: DistPlugin, c: SrcMod, d: SrcPlugin) => [a, b, c, d]',
      ].join('\n'))

      expectTscOk(tmpDir, [
        '--noEmit', '--skipLibCheck', '--allowJs', '--esModuleInterop',
        '--target', 'ES2015', '--module', 'CommonJS', '--moduleResolution', 'node', file,
      ])
    })
  })

  test('@tarojs/runner-utils published package resolves runtime and types', () => {
    withTempDir('taro-runner-utils-pkg-', tmpDir => {
      const pkgDir = path.join(tmpDir, 'node_modules', '@tarojs', 'runner-utils')
      fs.mkdirSync(pkgDir, { recursive: true })
      fs.copyFileSync(path.join(runnerUtilsRoot, 'package.json'), path.join(pkgDir, 'package.json'))
      fs.cpSync(path.join(runnerUtilsRoot, 'dist'), path.join(pkgDir, 'dist'), { recursive: true })

      const env = { ...process.env }
      delete env.NODE_PATH
      const nodeRes = spawnSync(process.execPath, ['-e', [
        "const path = require('node:path')",
        "const dir = path.resolve('node_modules/@tarojs/runner-utils')",
        'const expected = {',
        "  '@tarojs/runner-utils': 'dist/index.js',",
        "  '@tarojs/runner-utils/package.json': 'package.json',",
        "  '@tarojs/runner-utils/bundler/config/BundlerModule': 'dist/bundler/config/BundlerModule.js',",
        "  '@tarojs/runner-utils/bundler/config/BundlerModule.js': 'dist/bundler/config/BundlerModule.js',",
        "  '@tarojs/runner-utils/bundler/config/BundlerModule.d.ts': 'dist/bundler/config/BundlerModule.d.ts',",
        '}',
        'for (const [spec, rel] of Object.entries(expected)) {',
        "  const actual = path.relative(dir, require.resolve(spec)).replace(/\\\\/g, '/')",
        "  if (actual !== rel) throw new Error(spec + ' -> ' + actual)",
        '}',
      ].join('\n')], { cwd: tmpDir, env, encoding: 'utf8' })
      expect({ status: nodeRes.status, stderr: nodeRes.stderr }).toEqual({ status: 0, stderr: '' })

      const checkFile = path.join(tmpDir, 'check.ts')
      fs.writeFileSync(checkFile, [
        "import * as rootPkg from '@tarojs/runner-utils'",
        "import type { BundlerModule as M1 } from '@tarojs/runner-utils/bundler/config/BundlerModule'",
        "import type { BundlerModule as M2 } from '@tarojs/runner-utils/bundler/config/BundlerModule.js'",
        "import type { BundlerModule as M3 } from '@tarojs/runner-utils/bundler/config/BundlerModule.d.ts'",
        'export type Check = [typeof rootPkg, M1, M2, M3]',
      ].join('\n'))

      for (const [mod, res] of [['CommonJS', 'node'], ['NodeNext', 'NodeNext'], ['ESNext', 'bundler']]) {
        expectTscOk(tmpDir, ['--noEmit', '--skipLibCheck', '--module', mod, '--moduleResolution', res, checkFile])
      }
    })
  })

  test('MiniSplitChunksPlugin honors subclass getSubpackageConfig and isExcludeModule overrides', () => {
    class CustomMiniSplitChunksPlugin extends MiniSplitChunksPlugin {
      getSubpackageConfig () {
        return [
          { root: 'packageA/', pages: ['detail/index'] },
          { root: 'packageB', pages: ['list/index'] },
          { root: 'packageIndie', pages: ['index'], independent: true },
        ]
      }

      isExcludeModule (module: any): boolean {
        return Boolean(module?.resource?.includes('excluded-helper'))
      }
    }

    const plugin = new CustomMiniSplitChunksPlugin({
      combination: { config: {} } as any,
      fileType: { style: '.wxss', config: '.json', script: '.js', templ: '.wxml', xs: '.wxs' },
    })
    const thisCompilation = new SyncHook(['compilation'])
    const optimizeChunks = new SyncHook(['chunks'])
    const superApplySpy = jest
      .spyOn(Object.getPrototypeOf(MiniSplitChunksPlugin.prototype), 'apply')
      .mockImplementation(() => {})

    try {
      plugin.apply({
        webpack,
        context: repoRoot,
        options: { entry: {}, output: { path: path.join(repoRoot, 'dist') }, mode: 'production', optimization: {} },
        hooks: { thisCompilation },
      } as any)

      expect(plugin.subRoots).toEqual(['packageA', 'packageB'])

      const chunkA = { name: 'packageA/detail/index' }
      const chunkB = { name: 'packageB/list/index' }
      const sharedMod = { resource: '/src/shared-helper.js', _identifier: 's', identifier: () => 's' }
      const excludedMod = { resource: '/src/excluded-helper.js', _identifier: 'e', identifier: () => 'e' }
      const chunkGraph = {
        getOrderedChunkModulesIterable: () => [sharedMod, excludedMod],
        getModuleChunks: () => [chunkA, chunkB],
        getModuleChunksIterable: () => [chunkA],
      }

      thisCompilation.call({
        chunkGraph,
        entries: new Map(),
        hooks: { optimizeChunks, afterOptimizeChunks: new SyncHook(['chunks']), processAssets: new AsyncSeriesHook(['assets']) },
      })
      optimizeChunks.call([chunkA, chunkB])

      expect(Array.from(plugin.subCommonDeps.values()).map(d => d.resource)).toEqual(['/src/shared-helper.js'])
      const vendors = plugin.getSubPackageVendorsCacheGroup()
      expect(vendors.packageA.test(excludedMod, { chunkGraph })).toBe(false)
      expect(vendors.packageA.test(sharedMod, { chunkGraph })).toBe(true)
    } finally {
      superApplySpy.mockRestore()
    }
  })
})
