import { compile, getOutput } from './utils/compiler'

describe('compiler macros - defineAppConfig and definePageConfig', () => {
  test('should read app and page configs', async () => {
    const { stats, config } = await compile('compiler-macros')
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
