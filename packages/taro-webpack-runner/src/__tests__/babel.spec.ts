import { compile, getOutput } from './utils/compiler'

describe('babel', () => {
  test('should convert do expressions', async () => {
    const { stats, config } = await compile('babel')
    const assets = stats?.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
