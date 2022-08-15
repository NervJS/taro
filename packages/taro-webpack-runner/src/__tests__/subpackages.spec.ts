import { compile, getOutput } from './utils/compiler'

describe('subpackages', () => {
  test('should process subpackages', async () => {
    const { stats, config } = await compile('subpackages')
    const assets = stats?.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
