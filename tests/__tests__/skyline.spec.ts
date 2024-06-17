import { compile, getOutput } from './utils/compiler'

describe('Skyline', () => {
  describe('weapp', () => {
    test('should build weapp app', async () => {
      const { stats, config } = await compile('skyline', {
        platformType: 'mini',
      })

      const assets = stats.toJson().assets || []
      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })
  })
})
