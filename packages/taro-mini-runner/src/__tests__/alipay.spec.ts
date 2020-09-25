import { compile, getOutput } from './utils/compiler'
import { Template } from '@tarojs/cli/src/presets/platforms/alipay'

describe('alipay', () => {
  test('should build alipay app', async () => {
    const { stats, config } = await compile('react', {
      buildAdapter: 'alipay',
      globalObject: 'my',
      fileType: {
        templ: '.axml',
        style: '.acss',
        config: '.json',
        script: '.js',
        xs: '.sjs'
      },
      template: new Template()
    })
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
