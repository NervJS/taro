import * as helper from '@tarojs/helper'
import { JD } from '@tarojs/plugin-platform-jd'

import { compile, getOutput } from './utils/compiler'

describe('jd', () => {
  test('should build jd app', async () => {
    const program = new JD({ helper } as any, {})

    const { stats, config } = await compile('react', {
      buildAdapter: 'jd',
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
