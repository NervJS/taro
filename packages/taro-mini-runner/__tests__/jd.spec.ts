import { compile, getOutput } from './utils/compiler'

describe('jd', () => {
  test('should build jd app', async () => {
    const { stats, config } = await compile('react', {
      buildAdapter: 'jd'
    })
    const assets = stats.toJson().assets

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
