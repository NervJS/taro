import { compile, getOutput } from './utils/compiler'

describe('subpackages', () => {
  describe('should process subpackages', () => {
    test('web', async () => {
      const { stats, config } = await compile('subpackages', { platformType: 'web' })
      const assets = stats?.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })

    test('mini', async () => {
      const { stats, config } = await compile('subpackages', {
        platformType: 'mini',
        webpackChain (chain) {
          const config = chain.optimization.get('splitChunks')
          chain.optimization
            .splitChunks({
              ...config,
              cacheGroups: {
                ...config.cacheGroups,
                subutils: {
                  name: 'sub-utils',
                  minChunks: 2,
                  test: module => /[\\/]packageA[\\/]/.test(module.resource),
                  priority: 200
                }
              }
            })
        },
        addChunkPages (pages) {
          pages.set('packageA/detail/index', ['sub-utils'])
          pages.set('packageA/my/index', ['sub-utils'])
        }
      })
      const assets = stats.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })
  })
})
