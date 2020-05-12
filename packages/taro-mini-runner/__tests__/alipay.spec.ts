import { compile, getOutput } from './utils/compiler'

describe('alipay', () => {
  test('should build alipay app', async () => {
    const { stats, config } = await compile('react', {
      buildAdapter: 'alipay'
    })
    const assets = stats.toJson().assets

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
