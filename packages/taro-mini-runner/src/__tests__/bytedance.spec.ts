import * as helper from '@tarojs/helper'
import { TT } from '@tarojs/plugin-platform-tt'

import { compile, getOutput } from './utils/compiler'

describe('bytedance', () => {
  test('should build bytedance app', async () => {
    const program = new TT({ helper } as any, {})

    const { stats, config } = await compile('react', {
      buildAdapter: 'tt',
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
