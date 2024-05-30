import { compile, getOutput } from './utils/compiler'

// Note: 4.x 移除了对 vue2 的支持
describe.skip('vue', () => {
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
