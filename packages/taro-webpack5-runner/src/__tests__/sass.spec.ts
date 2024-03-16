import * as path from 'path'

import { compile, getOutput } from './utils/compiler'

describe('sass', () => {
  describe('should build app with scss', () => {
    test('web', async () => {
      const { stats, config } = await compile('sass', { platformType: 'web' })
      const assets = stats?.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })

    test('mini', async () => {
      const { stats, config } = await compile('sass', { platformType: 'mini' })
      const assets = stats?.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })
  })

  describe('should build app with sass', () => {
    test('web', async () => {
      const { stats, config } = await compile('sass', {
        platformType: 'web',
        sourceRoot: 'input'
      })
      const assets = stats?.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })

    test('mini', async () => {
      const { stats, config } = await compile('sass', {
        platformType: 'mini',
        sourceRoot: 'input'
      })
      const assets = stats?.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })
  })

  describe('should set global sass content with source', () => {
    test('web', async () => {
      const { stats, config } = await compile('sass', {
        platformType: 'web',
        framework: 'react',
        sass: {
          resource: path.resolve(__dirname, './fixtures/sass/src/common/global.scss')
        }
      })
      const assets = stats?.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })

    test('mini', async () => {
      const { stats, config } = await compile('sass', {
        platformType: 'mini',
        framework: 'react',
        sass: {
          resource: path.resolve(__dirname, './fixtures/sass/src/common/global.scss')
        }
      })
      const assets = stats?.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })
  })

  describe('should set global sass content with source & dir', () => {
    test('web', async () => {
      const { stats, config } = await compile('sass', {
        platformType: 'web',
        framework: 'react',
        sass: {
          resource: 'common/global.scss',
          projectDirectory: path.resolve(__dirname, './fixtures/sass/src')
        }
      })
      const assets = stats?.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })

    test('mini', async () => {
      const { stats, config } = await compile('sass', {
        platformType: 'mini',
        framework: 'react',
        sass: {
          resource: 'common/global.scss',
          projectDirectory: path.resolve(__dirname, './fixtures/sass/src')
        }
      })
      const assets = stats?.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })
  })

  describe('should set global sass content with data', () => {
    test('web', async () => {
      const { stats, config } = await compile('sass', {
        platformType: 'web',
        framework: 'react',
        sass: {
          resource: 'common/global.scss',
          projectDirectory: path.resolve(__dirname, './fixtures/sass/src'),
          data: '.body {background-color: red;}'
        }
      })
      const assets = stats?.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })

    test('mini', async () => {
      const { stats, config } = await compile('sass', {
        platformType: 'mini',
        framework: 'react',
        sass: {
          resource: 'common/global.scss',
          projectDirectory: path.resolve(__dirname, './fixtures/sass/src'),
          data: '.body {background-color: red;}'
        }
      })
      const assets = stats?.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })
  })
})
