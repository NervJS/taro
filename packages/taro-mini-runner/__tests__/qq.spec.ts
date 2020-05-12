import { compile, getOutput } from './utils/compiler'

describe('qq', () => {
  test('should build qq app', async () => {
    const { stats, config } = await compile('react', {
      buildAdapter: 'qq'
    })
    const assets = stats.toJson().assets

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })

  test('should base template loop 10 times', async () => {
    const { stats, config } = await compile('react', {
      buildAdapter: 'qq',
      baseLevel: 10
    })
    const assets = stats.toJson().assets

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
