import { createRequire } from 'node:module'
import path from 'node:path'

import { describe, expect, test } from 'vitest'

import AsyncSubPackagePlugin from '../src/plugins/AsyncSubPackagePlugin'

const runnerRequire = createRequire(path.resolve(__dirname, '../package.json'))
const webpack = runnerRequire('webpack')
const MiniCssExtractPlugin = runnerRequire('mini-css-extract-plugin')
const { SyncHook } = runnerRequire('tapable')
const testsRequire = createRequire(path.resolve(__dirname, '../../../tests/package.json'))
const { createFsFromVolume, Volume } = testsRequire('memfs')

const fixtureDir = path.resolve(__dirname, 'fixtures/async-subpackage-styles')

function compile (): Promise<Record<string, string>> {
  return new Promise((resolve, reject) => {
    const compiler = webpack({
      context: fixtureDir,
      mode: 'development',
      target: 'web',
      cache: false,
      devtool: false,
      entry: {
        'pages/detail/index': path.join(fixtureDir, 'pages/detail/index.js'),
        'pages/list/index': path.join(fixtureDir, 'pages/list/index.js'),
      },
      output: {
        path: path.join(fixtureDir, 'output'),
        filename: '[name].js',
        chunkFilename: '[name].js',
      },
      optimization: {
        minimize: false,
        splitChunks: {
          cacheGroups: {
            common: {
              chunks: 'initial',
              minChunks: 2,
              name: 'common',
              enforce: true,
            },
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
    new AsyncSubPackagePlugin({
      options: {
        sourceDir: fixtureDir,
        fileType: { style: '.wxss', templ: '.wxml', config: '.json' },
      },
      hooks: { afterGenerateFiles: new SyncHook(['compilation']) },
    } as any, new Map([
      ['pages/detail', 'async/detail'],
      ['pages/list', 'async/detail'],
    ])).apply(compiler)

    compiler.run((error, stats) => {
      if (error) return reject(error)
      if (stats.hasErrors()) return reject(new Error(stats.toString({ all: false, errors: true })))
      const assets: Record<string, string> = {}
      for (const asset of stats.compilation.getAssets()) {
        assets[asset.name] = compiler.outputFileSystem.readFileSync(
          path.join(fixtureDir, 'output', asset.name),
          'utf-8'
        )
      }
      compiler.close(closeError => closeError ? reject(closeError) : resolve(assets))
    })
  })
}

describe('async subpackage styles from a shared module', () => {
  test('moves the async style into every page that can reach the dynamic import', async () => {
    const assets = await compile()
    const asyncStyles = Object.keys(assets).filter(name => name.startsWith('async/detail/') && name.endsWith('.wxss'))

    expect(assets['pages/detail/index.wxss']).toContain('.demo')
    expect(assets['pages/list/index.wxss']).toContain('.demo')
    expect(asyncStyles).toEqual([])
  }, 30000)
})
