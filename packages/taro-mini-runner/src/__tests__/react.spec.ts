import { compile, getOutput } from './utils/compiler'

describe('react', () => {
  test('should build react app', async () => {
    const { stats, config } = await compile('react')
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
