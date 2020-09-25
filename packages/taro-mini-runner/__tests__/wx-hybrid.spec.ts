import { compile, getOutput } from './utils/compiler'

describe('wx-hybrid', () => {
  test('should compatible with weapp native pages and components', async () => {
    const { stats, config } = await compile('wx-hybrid', {
      compile: {
        exclude: [filename => (
          /node_modules/.test(filename) ||
          /echarts.js$/.test(filename) ||
          (/taro/.test(filename) && !(/taro-mini-runner/.test(filename)))
        )]
      }
    })
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
