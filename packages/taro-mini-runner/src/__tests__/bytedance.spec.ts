import { compile, getOutput } from './utils/compiler'
import { Template } from '@tarojs/cli/src/presets/platforms/tt'

describe('bytedance', () => {
  test('should build bytedance app', async () => {
    const { stats, config } = await compile('react', {
      buildAdapter: 'tt',
      globalObject: 'tt',
      fileType: {
        templ: '.ttml',
        style: '.ttss',
        config: '.json',
        script: '.js'
      },
      template: new Template()
    })
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
