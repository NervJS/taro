import fs from 'node:fs'
import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'

import { afterAll, describe, expect, test } from 'vitest'

import AsyncSubPackagePlugin from '../src/plugins/AsyncSubPackagePlugin'
import { normalizeAsyncSubPackageRules } from '../src/utils/asyncSubPackageRules'

const runnerRequire = createRequire(path.resolve(__dirname, '../package.json'))
const webpack = runnerRequire('webpack')
const MiniCssExtractPlugin = runnerRequire('mini-css-extract-plugin')
const { SyncHook } = runnerRequire('tapable')
const testsRequire = createRequire(path.resolve(__dirname, '../../../tests/package.json'))
const { createFsFromVolume, Volume } = testsRequire('memfs')

const PAGES = ['pages/sub1/index', 'pages/sub2/index', 'pages/sub3/index']
const tempDirs: string[] = []

afterAll(() => {
  for (const dir of tempDirs) fs.rmSync(dir, { recursive: true, force: true })
})

const PAD = `/* ${'x'.repeat(2000)} */\n`

function createFixture () {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'taro-async-rules-'))
  tempDirs.push(dir)
  const write = (relative: string, content: string) => {
    const file = path.join(dir, relative)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, content)
  }

  write('pages/sub1/index.js', `
export function load () {
  return Promise.all([import('./only1'), import('../../shared-a'), import('../../shared-b')])
}
`)
  write('pages/sub2/index.js', `
export function load () {
  return Promise.all([import('./only2'), import('../../shared-a')])
}
`)
  write('pages/sub3/index.js', `
export function load () {
  return Promise.all([import('./only3'), import('../../shared-b')])
}
`)
  write('pages/sub1/only1.js', `import './only1.css'\nexport default 'only1'\n`)
  write('pages/sub1/only1.css', '.only1 { color: red; }\n')
  write('pages/sub2/only2.js', `import './only2.css'\nexport default 'only2'\n`)
  write('pages/sub2/only2.css', '.only2 { color: green; }\n')
  write('pages/sub3/only3.js', `import './only3.css'\nexport default 'only3'\n`)
  write('pages/sub3/only3.css', '.only3 { color: blue; }\n')
  write('shared-a.js', `${PAD}import './shared-a.css'\nexport default 'shared-a'\n`)
  write('shared-a.css', '.shared-a { color: black; }\n')
  write('shared-b.js', `${PAD}import './shared-b.css'\nexport default 'shared-b'\n`)
  write('shared-b.css', '.shared-b { color: white; }\n')
  return dir
}

function createRules (maxSize: number) {
  return normalizeAsyncSubPackageRules([
    { path: 'pages/sub1/index', asyncSubPackage: { asyncRoot: 'pages/sub1-async' } },
    { path: 'pages/sub2/index', asyncSubPackage: { asyncRoot: 'pages/sub2-async' } },
    { path: 'pages/sub3/index', asyncSubPackage: { asyncRoot: 'pages/sub3-async' } },
    {
      path: /^pages\/sub\d+\/index$/,
      asyncSubPackage: { asyncRoot: ['pages/shared-async', 'pages/shared-async-2'], maxSize },
    },
  ], PAGES)
}

function compile (options: { maxSize: number, appConfig?: any }) {
  const fixtureDir = createFixture()
  const appConfig = options.appConfig || {
    pages: [],
    subPackages: [
      { root: 'pages/sub1', pages: ['index'] },
      { root: 'pages/sub2', pages: ['index'] },
      { root: 'pages/sub3', pages: ['index'] },
    ],
  }

  return new Promise<{ assets: Record<string, string>, errors: string[], appJson: any }>((resolve, reject) => {
    const compiler = webpack({
      context: fixtureDir,
      mode: 'development',
      target: 'web',
      cache: false,
      devtool: false,
      entry: {
        'pages/sub1/index': path.join(fixtureDir, 'pages/sub1/index.js'),
        'pages/sub2/index': path.join(fixtureDir, 'pages/sub2/index.js'),
        'pages/sub3/index': path.join(fixtureDir, 'pages/sub3/index.js'),
      },
      output: {
        path: path.join(fixtureDir, 'output'),
        filename: '[name].js',
        chunkFilename: '[name].js',
      },
      optimization: {
        minimize: false,
        splitChunks: {
          chunks: 'all',
          minSize: 0,
          cacheGroups: {
            common: { chunks: 'all', minChunks: 2, name: 'common' },
          },
        },
      },
      module: {
        rules: [{
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, runnerRequire.resolve('css-loader')],
        }],
      },
      plugins: [new MiniCssExtractPlugin({ filename: '[name].wxss' })],
    })
    compiler.outputFileSystem = createFsFromVolume(new Volume())

    const filesConfig: any = { app: { content: { ...appConfig } } }
    const miniPlugin: any = {
      appConfig,
      appEntry: path.join(fixtureDir, 'app.js'),
      filesConfig,
      options: {
        sourceDir: fixtureDir,
        fileType: { style: '.wxss', templ: '.wxml', config: '.json' },
        combination: { config: {} },
      },
      hooks: { afterGenerateFiles: new SyncHook(['compilation']) },
      getConfigFilePath: () => path.join(fixtureDir, 'app.json'),
      getConfigPath: () => 'app.json',
    }

    const plugin = new AsyncSubPackagePlugin(miniPlugin)
    plugin.updateAsyncRules(createRules(options.maxSize))
    plugin.updateAsyncRuntimeRoots([
      { sourceRoot: '', asyncRoot: 'pages/sub1-async' },
      { sourceRoot: '', asyncRoot: 'pages/sub2-async' },
      { sourceRoot: '', asyncRoot: 'pages/sub3-async' },
      { sourceRoot: '', asyncRoot: 'pages/shared-async' },
      { sourceRoot: '', asyncRoot: 'pages/shared-async-2' },
    ])
    plugin.apply(compiler)

    compiler.run((error, stats) => {
      if (error) return reject(error)
      const errors = stats.hasErrors()
        ? stats.toJson({ all: false, errors: true }).errors!.map(item => item.message)
        : []
      const assets: Record<string, string> = {}
      for (const asset of stats.compilation.getAssets()) {
        assets[asset.name] = compiler.outputFileSystem.readFileSync(
          path.join(fixtureDir, 'output', asset.name),
          'utf-8'
        )
      }
      miniPlugin.hooks.afterGenerateFiles.call(stats.compilation)
      const appJson = JSON.parse(filesConfig.app.content ? JSON.stringify(filesConfig.app.content) : '{}')
      compiler.close(closeError => closeError ? reject(closeError) : resolve({ assets, errors, appJson }))
    })
  })
}

describe('async subpackage rules mode', () => {
  test('私有 chunk 进各自 asyncRoot，共享 chunk 进 shared-async', async () => {
    const { assets, errors } = await compile({ maxSize: 1_000_000 })
    expect(errors).toEqual([])

    expect(Object.keys(assets).some(name => /^pages\/sub1-async\/async-/.test(name))).toBe(true)
    expect(Object.keys(assets).some(name => /^pages\/sub2-async\/async-/.test(name))).toBe(true)
    expect(Object.keys(assets).some(name => /^pages\/sub3-async\/async-/.test(name))).toBe(true)
    expect(Object.keys(assets).some(name => /^pages\/shared-async\/async-/.test(name))).toBe(true)
    expect(Object.keys(assets).some(name => /^pages\/shared-async-2\//.test(name))).toBe(false)

    expect(assets['pages/sub1/index.wxss']).toContain('.only1')
    expect(assets['pages/sub1/index.wxss']).toContain('.shared-a')
    expect(assets['pages/sub1/index.wxss']).toContain('.shared-b')
    expect(assets['pages/sub2/index.wxss']).toContain('.only2')
    expect(assets['pages/sub2/index.wxss']).toContain('.shared-a')
    expect(assets['pages/sub3/index.wxss']).toContain('.only3')
    expect(assets['pages/sub3/index.wxss']).toContain('.shared-b')
  }, 60000)

  test('共享 chunk 超过 maxSize 时拆分到第二个物理目标', async () => {
    const { assets, errors } = await compile({ maxSize: 3000 })
    expect(errors).toEqual([])
    expect(Object.keys(assets).some(name => /^pages\/shared-async\/async-/.test(name))).toBe(true)
    expect(Object.keys(assets).some(name => /^pages\/shared-async-2\/async-/.test(name))).toBe(true)
  }, 60000)

  test('只为使用的 asyncRoot 生成占位入口并注册 app.json', async () => {
    const { assets, appJson } = await compile({ maxSize: 1_000_000 })
    expect(assets['pages/sub1-async/index.js']).toBeTruthy()
    expect(assets['pages/sub1-async/index.json']).toBeTruthy()
    expect(assets['pages/sub1-async/index.wxml']).toBeTruthy()
    expect(assets['pages/shared-async/index.js']).toBeTruthy()
    expect(assets['pages/shared-async-2/index.js']).toBeUndefined()

    const roots = (appJson.subPackages || []).map((item: any) => item.root)
    expect(roots).toEqual(expect.arrayContaining([
      'pages/sub1-async',
      'pages/sub2-async',
      'pages/sub3-async',
      'pages/shared-async',
    ]))
    expect(roots).not.toContain('pages/shared-async-2')
  }, 60000)

  test('共享 chunk 超过 maxSize 且无法拆分时报错', async () => {
    const { errors } = await compile({ maxSize: 100 })
    expect(errors.join('\n')).toMatch(/超过 maxSize/)
  }, 60000)
})
