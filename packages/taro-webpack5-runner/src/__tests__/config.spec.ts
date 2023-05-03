import * as path from 'path'
import * as Chain from 'webpack-chain'

import { compile, getOutput } from './utils/compiler'

const sourceRoot = 'origin'
const outputRoot = 'output'

describe('config', () => {
  describe('should build from origin and pipe to output', () => {
    test('web', async () => {
      const { stats, config } = await compile('config', {
        platformType: 'web',
        sourceRoot,
        outputRoot
      })
      const assets = stats?.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })

    test('mini', async () => {
      const { stats, config } = await compile('config', {
        platformType: 'mini',
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
  })

  // FIXME 配置 copy 时，runner 会意外退出，暂时跳过
  describe('should copy assets', () => {
    test('web', async () => {
      const { stats, config } = await compile('config', {
        platformType: 'web',
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

    test('mini', async () => {
      const { stats, config } = await compile('config', {
        platformType: 'mini',
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
  })

  describe('should modify webpack chain', () => {
    test('web', async () => {
      const fn = jest.fn()
      await compile('config', {
        platformType: 'web',
        sourceRoot,
        webpackChain: chain => fn(chain instanceof Chain)
      })

      expect(fn).toBeCalledWith(true)
    })

    test('mini', async () => {
      const fn = jest.fn()
      await compile('config', {
        platformType: 'mini',
        sourceRoot,
        alias: {
          '@/utils': path.resolve(__dirname, './fixtures/config/origin/alias/utils')
        },
        webpackChain: chain => fn(chain instanceof Chain)
      })

      expect(fn).toBeCalledWith(true)
    })
  })

  describe('should resolved alias', () => {
    test('web', async () => {
      const { stats, config } = await compile('config', {
        platformType: 'web',
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

    test('mini', async () => {
      const { stats, config } = await compile('config', {
        platformType: 'mini',
        sourceRoot,
        entry: {
          extra: [`./${sourceRoot}/alias/files/index/index.js`]
        },
        alias: {
          '@/utils': path.resolve(__dirname, './fixtures/config/origin/alias/utils')
        }
      })
      const assets = stats.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })
  })

  describe('should compile\'s include work', () => {
    test('web', async () => {
      const include = jest.fn()

      await compile('config', {
        platformType: 'web',
        sourceRoot,
        compile: {
          include: [filename => include(filename)]
        }
      })

      expect(include).toBeCalled()
    })

    test('mini', async () => {
      const include = jest.fn()

      await compile('config', {
        platformType: 'mini',
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
  })

  describe('should compile\'s exclude work', () => {
    test('web', async () => {
      const exclude = jest.fn()

      await compile('config', {
        platformType: 'web',
        sourceRoot,
        compile: {
          exclude: [filename => exclude(filename)]
        }
      })

      expect(exclude).toBeCalled()
    })

    test('mini', async () => {
      const exclude = jest.fn()

      await compile('config', {
        platformType: 'mini',
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
  })

  test('should base template loop 20 times', async () => {
    const { stats, config } = await compile('config', {
      platformType: 'mini',
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
