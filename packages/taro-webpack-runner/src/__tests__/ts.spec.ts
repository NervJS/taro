import { compile, getOutput } from './utils/compiler'

describe('typescript', () => {
  test('should build project with ts', async () => {
    const { stats, config } = await compile('typescript')
    const assets = stats?.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
