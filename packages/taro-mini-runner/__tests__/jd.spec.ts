import { compile, getOutput } from './utils/compiler'
import { Template } from '@tarojs/cli/src/presets/platforms/jd'

describe('jd', () => {
  test('should build jd app', async () => {
    const { stats, config } = await compile('react', {
      buildAdapter: 'jd',
      globalObject: 'jd',
      fileType: {
        templ: '.jxml',
        style: '.jxss',
        config: '.json',
        script: '.js'
      },
      template: new Template()
    })
    const assets = stats.toJson().assets

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
