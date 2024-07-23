import { compile, getOutput } from './utils/compiler'

describe('css modules', () => {
  describe('should use css modules with module mode', () => {
    test('web', async () => {
      const { stats, config } = await compile('css-modules', {
        platformType: 'web',
        framework: 'react',
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
      const assets = stats?.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })

    test('mini', async () => {
      const { stats, config } = await compile('css-modules', {
        platformType: 'mini',
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
      const assets = stats.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })
  })

  describe('should use css modules with global mode', () => {
    test('web', async () => {
      const { stats, config } = await compile('css-modules', {
        platformType: 'web',
        framework: 'react',
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
      const assets = stats?.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })

    test('mini', async () => {
      const { stats, config } = await compile('css-modules', {
        platformType: 'mini',
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
      const assets = stats.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })
  })
})
