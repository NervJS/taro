import fs from 'node:fs'
import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'

import { afterAll, describe, expect, test } from 'vitest'

import AsyncSubPackagePlugin from '../src/plugins/AsyncSubPackagePlugin'
import { normalizeAsyncSubPackageRules } from '../src/utils/asyncSubPackageConfig'

const runnerRequire = createRequire(path.resolve(__dirname, '../package.json'))
const webpack = runnerRequire('webpack')
const MiniCssExtractPlugin = runnerRequire('mini-css-extract-plugin')
const { SyncHook } = runnerRequire('tapable')
const testsRequire = createRequire(path.resolve(__dirname, '../../../tests/package.json'))
const { createFsFromVolume, Volume } = testsRequire('memfs')

const tempDirs: string[] = []

afterAll(() => {
  for (const dir of tempDirs) fs.rmSync(dir, { recursive: true, force: true })
})

function createFixture () {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'taro-async-file-'))
  tempDirs.push(dir)
  const write = (relative: string, content: string) => {
    const file = path.join(dir, relative)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, content)
  }

  write('pages/sub1/index.js', `export function load () { return Promise.all([import('./only1'), import('../../components/heavy/index')]) }\n`)
  write('pages/sub2/index.js', `export function load () { return Promise.all([import('./only2'), import('../../components/heavy/index')]) }\n`)
  write('pages/sub1/only1.js', `import './only1.css'\nexport const MARK = 'only1'\nexport default 'only1'\n`)
  write('pages/sub1/only1.css', '.only1 { color: red; }\n')
  write('pages/sub2/only2.js', `import './only2.css'\nexport const MARK = 'only2'\nexport default 'only2'\n`)
  write('pages/sub2/only2.css', '.only2 { color: green; }\n')
  write('components/heavy/index.js', `import { helperValue } from './helper'\nimport './index.css'\nexport const MARK = 'heavy'\nexport const HELPER = helperValue\nexport default 'heavy'\n`)
  write('components/heavy/helper.js', `export const helperValue = 'heavy-helper'\n`)
  write('components/heavy/index.css', '.heavy { color: black; }\n')
  return dir
}

function createRules () {
  return normalizeAsyncSubPackageRules([
    { test: 'pages/sub1/only1', root: 'pages/sub1-async' },
    { test: 'pages/sub2/only2', root: 'pages/sub2-async' },
    { test: 'components/heavy/index', root: 'pages/shared-async' },
  ])
}

function compile (): Promise<{ assets: Record<string, string>, errors: string[], appJson: any }> {
  const fixtureDir = createFixture()
  const cacheGroups: any = {
    common: { chunks: 'all', minChunks: 2, name: 'common' },
  }
  const appConfig = {
    pages: [],
    subPackages: [
      { root: 'pages/sub1', pages: ['index'] },
      { root: 'pages/sub2', pages: ['index'] },
    ],
  }

  return new Promise((resolve, reject) => {
    const compiler = webpack({
      context: fixtureDir,
      mode: 'development',
      target: 'web',
      cache: false,
      devtool: false,
      entry: {
        'pages/sub1/index': path.join(fixtureDir, 'pages/sub1/index.js'),
        'pages/sub2/index': path.join(fixtureDir, 'pages/sub2/index.js'),
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
          cacheGroups,
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
    plugin.updateAsyncRules(createRules())
    plugin.updateAsyncRuntimeRoots([
      { sourceRoot: '', asyncRoot: 'pages/sub1-async' },
      { sourceRoot: '', asyncRoot: 'pages/sub2-async' },
      { sourceRoot: '', asyncRoot: 'pages/shared-async' },
    ])
    plugin.apply(compiler)

    compiler.run((error, stats) => {
      if (error) return reject(error)
      const errors = stats.hasErrors()
        ? stats.toJson({ all: false, errors: true }).errors!.map(item => item.message)
        : []
      const assets: Record<string, string> = {}
      for (const asset of stats.compilation.getAssets()) {
        assets[asset.name] = compiler.outputFileSystem.readFileSync(path.join(fixtureDir, 'output', asset.name), 'utf-8')
      }
      miniPlugin.hooks.afterGenerateFiles.call(stats.compilation)
      const appJson = JSON.parse(filesConfig.app.content ? JSON.stringify(filesConfig.app.content) : '{}')
      compiler.close(closeError => closeError ? reject(closeError) : resolve({ assets, errors, appJson }))
    })
  })
}

function jsAssets (assets: Record<string, string>, marker: string): string[] {
  return Object.keys(assets).filter(name => name.endsWith('.js') && assets[name].includes(marker))
}

describe('async subpackage file rules', () => {
  test('routes each file rule to its own asyncRoot', async () => {
    const { assets, errors } = await compile()
    expect(errors).toEqual([])

    const only1 = jsAssets(assets, `MARK = 'only1'`)
    const only2 = jsAssets(assets, `MARK = 'only2'`)
    const heavy = jsAssets(assets, `MARK = 'heavy'`)
    const helper = jsAssets(assets, `helperValue = 'heavy-helper'`)

    expect(only1.length).toBeGreaterThan(0)
    expect(only2.length).toBeGreaterThan(0)
    expect(heavy.length).toBeGreaterThan(0)
    expect(helper.length).toBeGreaterThan(0)

    expect(only1.every(name => name.startsWith('pages/sub1-async/'))).toBe(true)
    expect(only2.every(name => name.startsWith('pages/sub2-async/'))).toBe(true)
    expect(heavy.every(name => name.startsWith('pages/shared-async/'))).toBe(true)
    expect(helper.every(name => name.startsWith('pages/shared-async/'))).toBe(true)
  }, 60000)

  test('registers only the used async roots and relocates styles to consumers', async () => {
    const { assets, appJson } = await compile()

    const roots = (appJson.subPackages || []).map((item: any) => item.root)
    expect(roots).toContain('pages/sub1-async')
    expect(roots).toContain('pages/sub2-async')
    expect(roots).toContain('pages/shared-async')

    expect(assets['pages/sub1/index.wxss']).toContain('.only1')
    expect(assets['pages/sub1/index.wxss']).toContain('.heavy')
    expect(assets['pages/sub2/index.wxss']).toContain('.only2')
    expect(assets['pages/sub2/index.wxss']).toContain('.heavy')
  }, 60000)
})

describe('async subpackage file rules container isolation', () => {
  function createContainerFixture () {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'taro-async-container-'))
    tempDirs.push(dir)
    const write = (relative: string, content: string) => {
      const file = path.join(dir, relative)
      fs.mkdirSync(path.dirname(file), { recursive: true })
      fs.writeFileSync(file, content)
    }

    write('pages/sub1/index.js', `export function load () { return import('./container') }\n`)
    write('pages/sub1/container.js', `import '../../components/heavy/index'\nimport '../../components/light/index'\nexport const MARK = 'container'\nexport default 'container'\n`)
    write('components/heavy/index.js', `import { helperValue } from './helper'\nimport './index.css'\nexport const MARK = 'heavy'\nexport const HELPER = helperValue\nexport default 'heavy'\n`)
    write('components/heavy/helper.js', `export const helperValue = 'heavy-helper'\n`)
    write('components/heavy/index.css', '.heavy { color: black; }\n')
    write('components/light/index.js', `import './index.css'\nexport const MARK = 'light'\nexport default 'light'\n`)
    write('components/light/index.css', '.light { color: white; }\n')
    return dir
  }

  function compileContainer (): Promise<{ assets: Record<string, string>, errors: string[] }> {
    const fixtureDir = createContainerFixture()
    const cacheGroups: any = { common: { chunks: 'all', minChunks: 2, name: 'common' } }
    const appConfig = { pages: [], subPackages: [{ root: 'pages/sub1', pages: ['index'] }] }

    return new Promise((resolve, reject) => {
      const compiler = webpack({
        context: fixtureDir,
        mode: 'development',
        target: 'web',
        cache: false,
        devtool: false,
        entry: { 'pages/sub1/index': path.join(fixtureDir, 'pages/sub1/index.js') },
        output: { path: path.join(fixtureDir, 'output'), filename: '[name].js', chunkFilename: '[name].js' },
        optimization: { minimize: false, splitChunks: { chunks: 'all', minSize: 0, cacheGroups } },
        module: { rules: [{ test: /\.css$/, use: [MiniCssExtractPlugin.loader, runnerRequire.resolve('css-loader')] }] },
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
      plugin.updateAsyncRules(normalizeAsyncSubPackageRules([
        { test: 'components/heavy/index', root: 'pages/heavy-async' },
      ]))
      plugin.updateAsyncRuntimeRoots([{ sourceRoot: '', asyncRoot: 'pages/heavy-async' }])
      plugin.apply(compiler)

      compiler.run((error, stats) => {
        if (error) return reject(error)
        const errors = stats.hasErrors() ? stats.toJson({ all: false, errors: true }).errors!.map(i => i.message) : []
        const assets: Record<string, string> = {}
        for (const asset of stats.compilation.getAssets()) {
          assets[asset.name] = compiler.outputFileSystem.readFileSync(path.join(fixtureDir, 'output', asset.name), 'utf-8')
        }
        compiler.close(closeError => closeError ? reject(closeError) : resolve({ assets, errors }))
      })
    })
  }

  test('fails loudly instead of silently misplacing an un-ruled light sibling', async () => {
    const { errors } = await compileContainer()
    expect(errors.join('\n')).toMatch(/无法安全拆分/)
    expect(errors.join('\n')).toMatch(/light/)
  }, 60000)
})
