import * as path from 'path'
import { compile, getOutput } from './utils/compiler'

describe('sass', () => {
  test('should build app with scss', async () => {
    const { stats, config } = await compile('sass')
    const assets = stats.toJson().assets

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })

  test('should build app with sass', async () => {
    const { stats, config } = await compile('sass', {
      sourceRoot: 'input'
    })
    const assets = stats.toJson().assets

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })

  test('should set global sass content with source', async () => {
    const { stats, config } = await compile('sass', {
      framework: 'react',
      sass: {
        resource: path.resolve(__dirname, './fixtures/sass/src/common/global.scss')
      }
    })
    const assets = stats.toJson().assets

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })

  test('should set global sass content with source & dir', async () => {
    const { stats, config } = await compile('sass', {
      framework: 'react',
      sass: {
        resource: 'common/global.scss',
        projectDirectory: path.resolve(__dirname, './fixtures/sass/src')
      }
    })
    const assets = stats.toJson().assets

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })

  test('should set global sass content with data', async () => {
    const { stats, config } = await compile('sass', {
      framework: 'react',
      sass: {
        resource: 'common/global.scss',
        projectDirectory: path.resolve(__dirname, './fixtures/sass/src'),
        data: '.body {background-color: red;}'
      }
    })
    const assets = stats.toJson().assets

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
