import { compile, getOutput } from './utils/compiler'

describe('parse html', () => {
  test('should parse dangerouslySetInnerHTML', async () => {
    const { stats, config } = await compile('parse-html', { platformType: 'mini' })
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
