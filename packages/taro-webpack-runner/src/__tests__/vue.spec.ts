import { compile, getOutput } from './utils/compiler'

describe('vue', () => {
  test('should build vue app', async () => {
    const { stats, config } = await compile('vue', {
      framework: 'vue'
    })
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
