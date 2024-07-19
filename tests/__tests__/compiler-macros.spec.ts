import { compile, getOutput } from './utils/compiler'

describe('compiler-macros - defineAppConfig and definePageConfig', () => {
  describe('should read app and page configs', () => {
    test('web', async () => {
      const { stats, config } = await compile('compiler-macros', { platformType: 'web' })
      const assets = stats?.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })

    test('mini', async () => {
      const { stats, config } = await compile('compiler-macros', { platformType: 'mini' })
      const assets = stats.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })
  })
})
