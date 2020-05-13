import { compile, getOutput } from './utils/compiler'

describe('common style', () => {
  test('should extract common styles', async () => {
    const { stats, config } = await compile('common-style')
    const assets = stats.toJson().assets

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
