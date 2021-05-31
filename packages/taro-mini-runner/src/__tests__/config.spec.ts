import * as path from 'path'
import * as Chain from 'webpack-chain'

import { compile, getOutput } from './utils/compiler'

const sourceRoot = 'origin'
const outputRoot = 'output'

describe('config', () => {
  test('should build from origin and pipe to output', async () => {
    const { stats, config } = await compile('config', {
      sourceRoot,
      alias: {
        '@/utils': path.resolve(__dirname, './fixtures/config/origin/alias/utils')
      },
      outputRoot
    })
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })

  test('should copy assets', async () => {
    const { stats, config } = await compile('config', {
      sourceRoot,
      alias: {
        '@/utils': path.resolve(__dirname, './fixtures/config/origin/alias/utils')
      },
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
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })

  test('should modify webpack chain', async () => {
    const fn = jest.fn()
    await compile('config', {
      sourceRoot,
      alias: {
        '@/utils': path.resolve(__dirname, './fixtures/config/origin/alias/utils')
      },
      webpackChain: chain => fn(chain instanceof Chain)
    })

    expect(fn).toBeCalledWith(true)
  })

  test('should compile\'s include work', async () => {
    const include = jest.fn()

    await compile('config', {
      sourceRoot,
      alias: {
        '@/utils': path.resolve(__dirname, './fixtures/config/origin/alias/utils')
      },
      compile: {
        include: [filename => include(filename)]
      }
    })

    expect(include).toBeCalled()
  })

  test('should compile\'s exclude work', async () => {
    const exclude = jest.fn()

    await compile('config', {
      sourceRoot,
      alias: {
        '@/utils': path.resolve(__dirname, './fixtures/config/origin/alias/utils')
      },
      compile: {
        exclude: [filename => exclude(filename)]
      }
    })

    expect(exclude).toBeCalled()
  })

  test('should base template loop 20 times', async () => {
    const { stats, config } = await compile('config', {
      sourceRoot,
      alias: {
        '@/utils': path.resolve(__dirname, './fixtures/config/origin/alias/utils')
      },
      baseLevel: 20
    })
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
