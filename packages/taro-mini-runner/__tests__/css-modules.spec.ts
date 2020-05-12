import { compile, getOutput } from './utils/compiler'

describe('css modules', () => {
  test('should use css modules with module mode', async () => {
    const { stats, config } = await compile('css-modules', {
      postcss: {
        cssModules: {
          enable: true,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    })
    const assets = stats.toJson().assets

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })

  test('should use css modules with global mode', async () => {
    const { stats, config } = await compile('css-modules', {
      postcss: {
        cssModules: {
          enable: true,
          config: {
            namingPattern: 'global',
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    })
    const assets = stats.toJson().assets

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
