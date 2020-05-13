import { compile, getOutput } from './utils/compiler'

describe('bytedance', () => {
  test('should build bytedance app', async () => {
    const { stats, config } = await compile('react', {
      buildAdapter: 'tt'
    })
    const assets = stats.toJson().assets

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
