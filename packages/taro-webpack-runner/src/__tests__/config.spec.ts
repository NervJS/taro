import * as path from 'path'
import * as Chain from 'webpack-chain'

import { compile, getOutput } from './utils/compiler'

const sourceRoot = 'origin'
const outputRoot = 'output'

describe('config', () => {
  test('should build from origin and pipe to output', async () => {
    const { stats, config } = await compile('config', {
      sourceRoot,
      outputRoot
    })
    const assets = stats?.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })

  test('should copy assets', async () => {
    const { stats, config } = await compile('config', {
      sourceRoot,
      copy: {
        patterns: [{
          from: `${sourceRoot}/weapp`,
          to: 'dist/weapp'
        }, {
          from: `${sourceRoot}/irrelevant.txt`,
          to: 'dist/irrelevant.txt'
        }],
        options: {}
      }
    })
    const assets = stats?.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })

  test('should modify webpack chain', async () => {
    const fn = jest.fn()
    await compile('config', {
      sourceRoot,
      webpackChain: chain => fn(chain instanceof Chain)
    })

    expect(fn).toBeCalledWith(true)
  })

  test('should resolved alias', async () => {
    const { stats, config } = await compile('config', {
      sourceRoot,
      entry: {
        extra: [`./${sourceRoot}/alias/files/index/index.js`]
      },
      alias: {
        '@/utils': path.resolve(__dirname, './fixtures/config/origin/alias/utils')
      }
    })
    const assets = stats?.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
