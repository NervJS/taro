import { compile, getOutput } from './utils/compiler'
import { Template } from '@tarojs/cli/src/presets/platforms/qq'

describe('qq', () => {
  test('should build qq app', async () => {
    const { stats, config } = await compile('react', {
      buildAdapter: 'qq',
      globalObject: 'qq',
      fileType: {
        templ: '.qml',
        style: '.qss',
        config: '.json',
        script: '.js',
        xs: '.wxs'
      },
      template: new Template()
    })
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })

  test('should base template loop 10 times', async () => {
    const { stats, config } = await compile('react', {
      buildAdapter: 'qq',
      baseLevel: 10
    })
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
