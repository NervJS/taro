import { compile, getOutput } from './utils/compiler'

describe('plugin-export', () => {
  test('should build plugin export files', async () => {
    const { stats, config } = await compile('plugin-export')
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output.includes('dist/index.js')).toBe(true)
    expect(output.includes('dist/packageA/index.js')).toBe(true)
    expect(output).toMatchSnapshot()
  })
})
