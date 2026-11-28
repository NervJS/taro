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

    test('mini addChunkPages can read this.appConfig', async () => {
      let seenAppConfig: any
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
          seenAppConfig = this.appConfig
          const subpkg = this.appConfig?.subpackages?.[0]
          if (subpkg?.root && Array.isArray(subpkg.pages)) {
            for (const page of subpkg.pages) {
              pages.set(`${subpkg.root}/${page}`, ['sub-utils'])
            }
          }
        }
      })

      try {
        expect(stats.hasErrors()).toBe(false)
        expect(seenAppConfig).toBeDefined()
        expect(seenAppConfig.subpackages?.[0]?.root).toBe('packageA')

        const outputFs = stats.compilation.compiler.outputFileSystem
        const detailJs = outputFs.readFileSync('dist/packageA/detail/index.js').toString()
        const myJs = outputFs.readFileSync('dist/packageA/my/index.js').toString()
        expect(detailJs).toContain('require("../../sub-utils")')
        expect(myJs).toContain('require("../../sub-utils")')
      } finally {
        getOutput(stats, config)
      }
    })
  })
})
