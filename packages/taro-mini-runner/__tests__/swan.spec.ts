import { compile, getOutput } from './utils/compiler'

describe('swan', () => {
  test('should build swan app', async () => {
    const { stats, config } = await compile('react', {
      buildAdapter: 'swan'
    })
    const assets = stats.toJson().assets

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
