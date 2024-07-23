import * as helper from '@tarojs/helper'
import { Alipay } from '@tarojs/plugin-platform-alipay'

import { compile, getOutput } from './utils/compiler'

describe('tabbar', () => {
  test('should weapp tabbar work', async () => {
    const { stats, config } = await compile('tabbar', { platformType: 'mini' })
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })

  test('should alipay tabbar work', async () => {
    const program = new Alipay({ helper } as any, {})

    const { stats, config } = await compile('tabbar', {
      platformType: 'mini',
      buildAdapter: 'alipay',
      globalObject: program.globalObject,
      fileType: program.fileType,
      template: program.template,
      runtimePath: program.runtimePath
    })
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})

describe('custom tabbar', () => {
  test('should weapp custom tabbar work', async () => {
    const { stats, config } = await compile('custom-tabbar', { platformType: 'mini' })
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
