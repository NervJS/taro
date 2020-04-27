import { compile, getOutput } from './utils/compiler'

describe.only('nerv', () => {
  test('should build nerv app', async () => {
    const { stats, config } = await compile('nerv', {
      framework: 'nerv'
    })
    const assets = stats.toJson().assets

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
