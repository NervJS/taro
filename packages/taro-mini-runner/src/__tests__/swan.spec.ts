import { compile, getOutput } from './utils/compiler'
import { Template } from '@tarojs/cli/src/presets/platforms/swan'

describe('swan', () => {
  test('should build swan app', async () => {
    const { stats, config } = await compile('react', {
      buildAdapter: 'swan',
      globalObject: 'swan',
      fileType: {
        templ: '.swan',
        style: '.css',
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
