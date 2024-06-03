import { compile, getOutput } from './utils/compiler'

describe('typescript', () => {
  describe('should build project with ts', () => {
    test('web', async () => {
      const { stats, config } = await compile('typescript', { platformType: 'web' })
      const assets = stats?.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })

    test('mini', async () => {
      const { stats, config } = await compile('typescript', { platformType: 'mini' })
      const assets = stats.toJson().assets || []

      expect(assets.length).toMatchSnapshot()

      const output = getOutput(stats, config)
      expect(output).toMatchSnapshot()
    })
  })
})
