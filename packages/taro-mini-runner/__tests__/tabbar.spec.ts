import { compile, getOutput } from './utils/compiler'

describe('tabbar', () => {
  test('should weapp tabbar work', async () => {
    const { stats, config } = await compile('tabbar')
    const assets = stats.toJson().assets

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })

  test('should alipay tabbar work', async () => {
    const { stats, config } = await compile('tabbar', {
      buildAdapter: 'alipay'
    })
    const assets = stats.toJson().assets

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
