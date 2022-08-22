import { compile, getOutput } from './utils/compiler'

describe('vue3', () => {
  test('should build vue3 app', async () => {
    const { stats, config } = await compile('vue3', {
      framework: 'vue3'
    })
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
