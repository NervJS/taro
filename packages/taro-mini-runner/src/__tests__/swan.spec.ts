import * as helper from '@tarojs/helper'
import { Swan } from '@tarojs/plugin-platform-swan'

import { compile, getOutput } from './utils/compiler'

describe('swan', () => {
  test('should build swan app', async () => {
    const program = new Swan({ helper } as any, {})

    const { stats, config } = await compile('react', {
      buildAdapter: 'swan',
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
