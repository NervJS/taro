import { compile, getOutput } from './utils/compiler'

describe('custom tabbar', () => {
  test('should weapp custom tabbar work', async () => {
    const { stats, config } = await compile('custom-tabbar')
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
